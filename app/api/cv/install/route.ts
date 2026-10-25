import {env} from 'cloudflare:workers';
import {privateHeaders} from '../../../../lib/cv-access';

export const dynamic='force-dynamic';
// Maintenance-only upload. Disabled unless an expiring secret is configured.
// No public asset URL; the existing password-gated download is the only reader.
interface UploadBindings {
 CV_UPLOAD_TOKEN?:string;
 CV_UPLOAD_EXPIRES?:string;
 BUCKET?: {
  head(key:string):Promise<{customMetadata?:Record<string,string>}|null>;
  get(key:string):Promise<{arrayBuffer():Promise<ArrayBuffer>}|null>;
  put(key:string,body:Uint8Array,options:unknown):Promise<unknown>;
 };
}
const expectedSize=342697;
const expectedHash='594f9209ffabc48e587e7e5b1a3690afeb50094dd755171c0c713f212aa4b7a5';
// Stage the replacement separately so the current download stays available.
const uploadKey='private/cv/yuri-choi-v2026-594f9209.pdf';
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
const reply=(status:number,body:unknown)=>Response.json(body,{status,headers:privateHeaders});
export async function POST(request:Request){
 const config=env as UploadBindings;
 const expires=Date.parse(config.CV_UPLOAD_EXPIRES||'');
 if(!config.CV_UPLOAD_TOKEN||!Number.isFinite(expires)||Date.now()>=expires)return reply(404,{error:'Not found'});
 const provided=request.headers.get('authorization')||'';
 if(provided.length>256)return reply(403,{error:'Forbidden'});
 const digest=async(value:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));
 const [actual,target]=await Promise.all([digest(provided),digest('Bearer '+config.CV_UPLOAD_TOKEN)]);
 let difference=0;for(let i=0;i<target.length;i++)difference|=actual[i]^target[i];
 if(difference)return reply(403,{error:'Forbidden'});
 if(!config.BUCKET)return reply(503,{error:'Storage unavailable'});
 if(request.headers.get('content-type')!=='application/pdf')return reply(415,{error:'Expected PDF'});
 if(Number(request.headers.get('content-length'))!==expectedSize)return reply(413,{error:'Unexpected size'});
 const reader=request.body?.getReader();if(!reader)return reply(400,{error:'Missing PDF'});
 const bytes=new Uint8Array(expectedSize);let offset=0;
 while(true){const part=await reader.read();if(part.done)break;if(offset+part.value.length>expectedSize){await reader.cancel();return reply(413,{error:'Too large'});}bytes.set(part.value,offset);offset+=part.value.length;}
 if(offset!==expectedSize||hex(await crypto.subtle.digest('SHA-256',bytes))!==expectedHash)return reply(422,{error:'PDF mismatch'});
 try{
  const previous=await config.BUCKET.head(uploadKey);
  if(previous&&previous.customMetadata?.sha256!==expectedHash)return reply(409,{error:'Existing file differs'});
  if(!previous)await config.BUCKET.put(uploadKey,bytes,{httpMetadata:{contentType:'application/pdf',cacheControl:'private, no-store'},customMetadata:{sha256:expectedHash}});
  const stored=await config.BUCKET.get(uploadKey);
  const storedBytes=await stored?.arrayBuffer();
  if(!storedBytes||storedBytes.byteLength!==expectedSize||hex(await crypto.subtle.digest('SHA-256',storedBytes))!==expectedHash)return reply(503,{error:'Stored PDF verification failed'});
  return reply(200,{stored:true,sha256:expectedHash,size:expectedSize});
 }catch{return reply(503,{error:'Storage unavailable'});}
}
export function GET(){return reply(404,{error:'Not found'});}
