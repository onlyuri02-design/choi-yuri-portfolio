import {env} from 'cloudflare:workers';
import {excludedCookie,privateHeaders,registerExclusion,registeredExclusion} from '../../../../lib/analytics-live';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response(null,{status:403,headers:privateHeaders});
 const raw=await request.text();if(raw.length>100)return new Response(null,{status:413});
 let excluded=true;try{if(raw)excluded=JSON.parse(raw).excluded!==false;}catch{return new Response(null,{status:400});}
 try{
  const visitor=await registerExclusion(request,env,excluded?'self':'inactive');
  const active=excluded||await registeredExclusion(request,env);
  return Response.json({excluded:active,registered:!!visitor&&!!env.DB},{headers:{...privateHeaders,'Set-Cookie':active?excludedCookie():'yc_analytics_excluded=; Path=/; Max-Age=0; SameSite=Lax; Secure'}});
 }catch{return Response.json({error:'서버 제외 설정 실패'},{status:503,headers:privateHeaders});}
}
