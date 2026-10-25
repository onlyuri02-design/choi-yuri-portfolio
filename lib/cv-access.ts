// Server-only module. Never import into client components or expose bucket keys.
export interface CVBindings {
 BUCKET?: {head(key:string):Promise<unknown>;get(key:string):Promise<{body:ReadableStream<Uint8Array>}|null>};
 CV_FILE_KEY?: string;
 // PBKDF2-SHA256 / 100000 iterations: 16-byte salt hex : 32-byte digest hex.
 CV_PASSWORD_HASH?: string;
}
export const privateHeaders={'Cache-Control':'private, no-store, max-age=0','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
export function configured(env:CVBindings){return Boolean(env.BUCKET&&env.CV_FILE_KEY&&/^[a-f0-9]{32}:[a-f0-9]{64}$/i.test(env.CV_PASSWORD_HASH||''));}
export async function cvReady(env:CVBindings){return configured(env)&&Boolean(await env.BUCKET!.head(env.CV_FILE_KEY!));}
export async function verifyPassword(password:string,encoded:string){
 if(!/^[a-f0-9]{32}:[a-f0-9]{64}$/i.test(encoded)||!password||password.length>256)return false;
 const [salt,expected]=encoded.split(':');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:Uint8Array.from(salt.match(/../g)!,v=>parseInt(v,16)),iterations:100000},key,256);
 const actual=new Uint8Array(bits),target=Uint8Array.from(expected.match(/../g)!,v=>parseInt(v,16));let different=0;for(let i=0;i<32;i++)different|=actual[i]^target[i];return different===0;
}
// Additional best-effort per-isolate abuse guard. Edge-wide limits should also be
// enabled when the owner supplies the final PDF/password and enables downloads.
const attempts=new Map<string,{count:number;expires:number}>();
export function allowAttempt(ip:string,now=Date.now()){
 for(const [key,value] of attempts)if(value.expires<=now)attempts.delete(key);
 const record=attempts.get(ip);if(record){record.count++;return record.count<=10;}
 if(attempts.size>=2000)return false;
 attempts.set(ip,{count:1,expires:now+600000});return true;
}
export async function downloadCV(request:Request,env:CVBindings){
 const error=(message:string,status:number)=>Response.json({error:message},{status,headers:privateHeaders});
 if(request.method!=='POST')return error('Method not allowed',405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return error('Forbidden',403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return error('Unsupported request',415);
 if(!configured(env))return error('CV not available',503);
 if(!allowAttempt(request.headers.get('cf-connecting-ip')||'local'))return error('Try later',429);
 const reader=request.body?.getReader();if(!reader)return error('Invalid request',400);
 let raw='',size=0;const decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2048){await reader.cancel();return error('Request too large',413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
 let body:unknown;try{body=JSON.parse(raw)}catch{return error('Invalid request',400)}
 const password=body&&typeof body==='object'&&'password' in body?body.password:null;
 if(typeof password!=='string'||!(await verifyPassword(password,env.CV_PASSWORD_HASH!)))return error('Invalid password',401);
 const file=await env.BUCKET!.get(env.CV_FILE_KEY!);if(!file)return error('CV not available',503);
 return new Response(file.body,{headers:{...privateHeaders,'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Yuri-Choi-CV.pdf"'}});
}
