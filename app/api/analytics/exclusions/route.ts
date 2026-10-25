import {env} from 'cloudflare:workers';
import {isOwner,privateHeaders} from '../../../../lib/analytics-live';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const reply=(status:number,body:unknown)=>Response.json(body,{status,headers:privateHeaders});
 if(!isOwner(request,env))return reply(401,{error:'소유자 인증이 필요합니다.'});
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply(403,{error:'Forbidden'});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'Invalid content type'});
 const raw=await request.text();if(raw.length>256)return reply(413,{error:'Too large'});
 let body;try{body=JSON.parse(raw);}catch{return reply(400,{error:'Invalid JSON'});}
 if(!/^[a-f0-9]{12}$/.test(body?.browser)||typeof body?.excluded!=='boolean')return reply(400,{error:'Invalid visitor'});
 if(!env.DB)return reply(503,{error:'Storage unavailable'});
 try{
  // Resolve the displayed prefix to exactly one full server-owned identifier.
  const result=await env.DB.batch([env.DB.prepare("SELECT DISTINCT visitor FROM traffic_activity WHERE substr(visitor,1,12)=? UNION SELECT substr(key,18) AS visitor FROM analytics_state WHERE key LIKE 'excluded_visitor:%' AND substr(key,18,12)=?").bind(body.browser,body.browser)]);
  const rows=result[0].results as {visitor:string}[];
  if(rows.length!==1)return reply(409,{error:'방문 ID를 확정할 수 없습니다.'});
  await env.DB.batch([env.DB.prepare("INSERT INTO analytics_state (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind('excluded_visitor:'+rows[0].visitor,body.excluded?'manual':'inactive')]);
  return reply(200,{excluded:body.excluded,browser:body.browser});
 }catch{return reply(503,{error:'제외 설정을 저장하지 못했습니다.'});}
}
