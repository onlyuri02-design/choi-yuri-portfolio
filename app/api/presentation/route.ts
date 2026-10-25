import {env} from 'cloudflare:workers';
import {isOwner,localPreview,privateHeaders} from '../../../lib/analytics-live';
export const dynamic='force-dynamic';
const key='dashboard_presentation';
const authorized=(r:Request)=>isOwner(r,env)||localPreview(r);
async function read(){const row=await env.DB?.prepare('SELECT value FROM analytics_state WHERE key=?').bind(key).first<{value:string}>();return row?JSON.parse(row.value):{presentation:{},revision:0};}
export async function GET(request:Request){
 if(!authorized(request))return Response.json({error:'Unauthorized'},{status:401,headers:privateHeaders});
 return Response.json({...await read(),canEdit:true},{headers:privateHeaders});
}
export async function PUT(request:Request){
 if(!authorized(request))return Response.json({error:'Unauthorized'},{status:401,headers:privateHeaders});
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response(null,{status:403,headers:privateHeaders});
 const raw=await request.text();if(raw.length>200000)return new Response(null,{status:413,headers:privateHeaders});
 let input;try{input=JSON.parse(raw);}catch{return new Response(null,{status:400,headers:privateHeaders});}
 if(!Number.isInteger(input.revision)||input.revision<0||!input.presentation||typeof input.presentation!=='object'||Array.isArray(input.presentation))return new Response(null,{status:400,headers:privateHeaders});
 const next={presentation:input.presentation,revision:input.revision+1};
 const result=await env.DB?.prepare(`INSERT INTO analytics_state (key,value) SELECT ?,? WHERE ?=0 ON CONFLICT(key) DO UPDATE SET value=? WHERE json_extract(analytics_state.value,'$.revision')=?`).bind(key,JSON.stringify(next),input.revision,JSON.stringify(next),input.revision).run();
 // Existing rows with revisions > 0 need a direct CAS update (INSERT SELECT is empty).
 if(input.revision>0){const update=await env.DB?.prepare("UPDATE analytics_state SET value=? WHERE key=? AND json_extract(value,'$.revision')=?").bind(JSON.stringify(next),key,input.revision).run();if(!update?.meta.changes)return Response.json(await read(),{status:409,headers:privateHeaders});}
 else if(!result?.meta.changes)return Response.json(await read(),{status:409,headers:privateHeaders});
 return Response.json({...next,canEdit:true},{headers:privateHeaders});
}
