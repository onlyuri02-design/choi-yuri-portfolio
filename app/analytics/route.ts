import { env } from 'cloudflare:workers';
import { excludedCookie, isOwner, localPreview, privateHeaders } from '../../lib/analytics-live';
import dashboard from '../../lib/analytics-dashboard.html?raw';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  if(['yurichoi.com','www.yurichoi.com'].includes(new URL(request.url).hostname)) return Response.redirect('https://yuri-choi.yurinananana.chatgpt.site/analytics',302);
  if (!isOwner(request,env) && !localPreview(request)) {
    const signedIn=!!request.headers.get('oai-authenticated-user-email');
    return new Response(`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>방문 통계 · 소유자 전용</title><body style="font:16px/1.7 system-ui;margin:12vh auto;padding:24px;max-width:480px"><h1>방문 통계</h1><p>${signedIn?'이 계정에는 방문 통계 접근 권한이 없어요. 사이트 소유자 계정으로 로그인해 주세요.':'방문 기록은 사이트 소유자만 볼 수 있어요.'}</p><a href="${signedIn?'/signout-with-chatgpt?return_to=%2Fanalytics':'/signin-with-chatgpt?return_to=%2Fanalytics'}" target="_top">${signedIn?'계정 변경':'ChatGPT로 로그인'} →</a></body></html>`,{status:signedIn?403:200,headers:{...privateHeaders,'Content-Type':'text/html; charset=utf-8','X-Frame-Options':'DENY'}});
  }
  return new Response(dashboard,{headers:{...privateHeaders,'Content-Type':'text/html; charset=utf-8','X-Frame-Options':'DENY',...(!localPreview(request)?{'Set-Cookie':excludedCookie()}:{})}});
}
