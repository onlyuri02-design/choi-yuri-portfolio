import { isIP } from 'node:net';
type Env = { DB?: D1Database; ANALYTICS_SECRET?: string; ANALYTICS_OWNER_EMAIL?: string };
// Only the two public portfolio hosts collect traffic; hosting previews do not.
export const productionHosts = new Set(['yurichoi.com','www.yurichoi.com']);
export const automatedAgent = (ua:string) => /bot|crawler|spider|headless|preview|playwright|puppeteer|selenium|webdriver/i.test(ua);
export function visitorIP(request: Request): string | null {
  const raw=(request.headers.get('cf-connecting-ipv6')||request.headers.get('cf-connecting-ip')||'').trim().toLowerCase();
  if(!isIP(raw))return null;
  if(isIP(raw)===4){const [a,b]=raw.split('.').map(Number);if(a===0||a===10||a===127||a>=224||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168))return null;return raw;}
  const ip=new URL('https://['+raw+']/').hostname.slice(1,-1);
  return ip==='::'||ip==='::1'||ip==='2a06:98c0:3600::103'||/^(fc|fd|fe[89ab]|ff)/.test(ip)||ip.startsWith('::ffff:')?null:ip;
}
export async function requestVisitor(request:Request,env:Env){
  const ip=visitorIP(request),ua=request.headers.get('user-agent');
  return ip&&ua&&env.ANALYTICS_SECRET?privateVisitor(env.ANALYTICS_SECRET,ip,ua):null;
}
export const externalVisitorSQL=(column='visitor')=>`NOT EXISTS (SELECT 1 FROM analytics_state exclusion WHERE exclusion.key='excluded_visitor:' || ${column} AND exclusion.value!='inactive')`;
export async function registerExclusion(request:Request,env:Env,reason='self'){
  const visitor=await requestVisitor(request,env);
  if(visitor&&env.DB)await env.DB.batch([env.DB.prepare("INSERT INTO analytics_state (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=CASE WHEN analytics_state.value='owner' THEN 'owner' ELSE excluded.value END").bind('excluded_visitor:'+visitor,reason)]);
  return visitor;
}
export async function registeredExclusion(request:Request,env:Env){
  const visitor=await requestVisitor(request,env);
  if(!visitor||!env.DB)return false;
  const rows=await env.DB.batch([env.DB.prepare("SELECT value FROM analytics_state WHERE key=? AND value!='inactive'").bind('excluded_visitor:'+visitor)]);
  return !!rows[0].results?.length;
}
type Geo = { country: string; region: string; city: string };
export const privateHeaders = { 'Cache-Control': 'private, no-store', Vary: 'Cookie, oai-authenticated-user-email', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' };
export function localPreview(request: Request) {
  const u = new URL(request.url);
  return ['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol === 'http:';
}
export function isOwner(request: Request, env: Env) {
  const expected = env.ANALYTICS_OWNER_EMAIL?.trim().toLowerCase();
  return !!expected && request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase() === expected;
}
export function isExcluded(request: Request, env: Env) {
  return isOwner(request, env) || /(?:^|;\s*)yc_analytics_excluded=1(?:;|$)/.test(request.headers.get('cookie') || '');
}
export function deviceType(ua: string) {
  if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) return '태블릿';
  if (/mobile|iphone|ipod/i.test(ua)) return '모바일';
  return ua ? '데스크톱' : '알 수 없음';
}
export function detailPage(page: string, input: unknown) {
  if (typeof input !== 'string' || input.length > 140 || /[?<>\\\s]/.test(input)) return page;
  if (input === page) return input;
  if (/^\/#(?:case|project|work|cv|process)\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(input) && input.startsWith(page + '/')) return input;
  return page;
}
export async function privateVisitor(secret: string, ip: string, ua: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, encoder.encode(JSON.stringify(['activity-v1', ip, ua.slice(0,512)])));
  return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2,'0')).join('');
}
export function acquisition(input: unknown): string {
  if (typeof input !== 'string') return '수집 전';
  const host=input.toLowerCase().replace(/^www\./,'');
  if (!host || ['yurichoi.com','yuri-choi.yurinananana.chatgpt.site'].includes(host)) return '직접·출처 미상';
  if (host.length>253 || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return '직접·출처 미상';
  const matches=(domain:string)=>host===domain||host.endsWith('.'+domain);
  if (['google.com','google.co.kr','naver.com','daum.net','bing.com','duckduckgo.com','yahoo.com'].some(matches)) return '검색';
  if (['instagram.com','facebook.com','linkedin.com','t.co','twitter.com','x.com','threads.net','youtube.com'].some(matches)) return '소셜';
  return '외부 링크';
}
export const clickActions=new Set(['CV 열기','CV 다운로드 버튼','이메일 문의','전화 문의','인스타그램','YURI&YURI 방문','Work 열기','Notes 열기','케이스 상세']);
export function activityStatements(db: D1Database, now: Date, day: string, page: string, visitor: string | null, device: string, geo: Geo, channel='수집 전') {
  const at = now.toISOString(), cutoff = new Date(now.getTime() - 30*86400000).toISOString();
  const sessionCutoff = new Date(now.getTime() - 30*60000).toISOString();
  const result = [
    db.prepare('DELETE FROM traffic_activity WHERE at < ?').bind(cutoff),
    db.prepare('DELETE FROM traffic_presence WHERE last_seen < ?').bind(cutoff),
    db.prepare('DELETE FROM traffic_clicks WHERE at < ?').bind(cutoff),
    db.prepare("INSERT OR IGNORE INTO analytics_state (key,value) VALUES ('activity_started_at',?)").bind(at),
    db.prepare("INSERT OR IGNORE INTO analytics_state (key,value) VALUES ('interaction_started_at',?)").bind(at),
  ];
  if (visitor) result.push(db.prepare(`INSERT INTO traffic_presence (visitor,session,first_seen,last_seen,page,device,country,region,city) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(visitor) DO UPDATE SET session=CASE WHEN traffic_presence.last_seen < ? THEN excluded.session ELSE traffic_presence.session END,last_seen=excluded.last_seen,page=excluded.page,device=excluded.device,country=excluded.country,region=excluded.region,city=excluded.city`).bind(visitor,crypto.randomUUID(),at,at,page,device,geo.country,geo.region,geo.city,sessionCutoff));
  result.push(db.prepare('INSERT INTO traffic_activity (id,day,at,visitor,session,page,device,country,region,city,channel) VALUES (?,?,?,?,(SELECT session FROM traffic_presence WHERE visitor=?),?,?,?,?,?,?)').bind(crypto.randomUUID(),day,at,visitor,visitor,page,device,geo.country,geo.region,geo.city,channel));
  return result;
}
export function excludedCookie() { return 'yc_analytics_excluded=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure'; }

export async function readAnalytics(request: Request, env: Env, now = new Date()) {
  if (!isOwner(request,env) && !localPreview(request)) return Response.json({error:'소유자 로그인이 필요합니다.'},{status:401,headers:privateHeaders});
  if (!env.DB) return Response.json({error:'방문 기록 저장소를 사용할 수 없습니다.'},{status:503,headers:privateHeaders});
  const u = new URL(request.url), today = new Date(now.getTime()+9*3600000).toISOString().slice(0,10);
  const day = u.searchParams.get('day') || today;
  const earliest = new Date(now.getTime()-29*86400000+9*3600000).toISOString().slice(0,10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day > today || day < earliest) return Response.json({error:'최근 30일 안의 날짜를 선택하세요.'},{status:400,headers:privateHeaders});
  const days=Number(u.searchParams.get('days')||1);
  if (![1,7,30].includes(days)) return Response.json({error:'지원하지 않는 기간입니다.'},{status:400,headers:privateHeaders});
  const from=[earliest,new Date(new Date(day+'T00:00:00Z').getTime()-(days-1)*86400000).toISOString().slice(0,10)].sort().at(-1)!;
  try {
    if(isOwner(request,env))await registerExclusion(request,env,'owner');
    const cutoff = new Date(now.getTime()-5*60000).toISOString();
    const start = new Date(now.getTime()-30*86400000).toISOString();
    const batch = await env.DB.batch([
      env.DB.prepare(`SELECT day,COUNT(*) AS views,COUNT(DISTINCT visitor) AS estimated_visitors FROM traffic_activity WHERE day >= ? AND ${externalVisitorSQL()} GROUP BY day ORDER BY day`).bind(earliest),
      env.DB.prepare('SELECT day,page,views FROM page_views_daily WHERE day = ? ORDER BY views DESC').bind(day),
      env.DB.prepare('SELECT at,page,device,country,region,city,substr(visitor,1,12) AS browser,substr(session,1,12) AS session FROM traffic_activity WHERE day = ? AND at >= ? ORDER BY at DESC,id DESC LIMIT 500').bind(day,start),
      env.DB.prepare('SELECT COUNT(*) AS views,COUNT(DISTINCT visitor) AS visitors,COUNT(DISTINCT session) AS visits FROM traffic_activity WHERE day=? AND at >= ?').bind(day,start),
      env.DB.prepare(`SELECT last_seen,page,device,country,region,city,substr(visitor,1,12) AS browser FROM traffic_presence WHERE last_seen >= ? AND ${externalVisitorSQL()} ORDER BY last_seen DESC LIMIT 100`).bind(cutoff),
      env.DB.prepare(`SELECT COUNT(*) AS count FROM traffic_presence WHERE last_seen >= ? AND ${externalVisitorSQL()}`).bind(cutoff),
      env.DB.prepare('SELECT device,COUNT(*) AS views FROM traffic_activity WHERE day=? AND at >= ? GROUP BY device ORDER BY views DESC').bind(day,start),
      env.DB.prepare('SELECT country,region,city,views,estimated_visitors FROM traffic_regions_daily WHERE day=? ORDER BY views DESC').bind(day),
      env.DB.prepare("SELECT value FROM analytics_state WHERE key='activity_started_at'").bind(),
      env.DB.prepare(`SELECT COUNT(DISTINCT a.visitor) AS count FROM traffic_activity a WHERE a.day=? AND a.at >= ? AND ${externalVisitorSQL('a.visitor')} AND EXISTS (SELECT 1 FROM traffic_activity b WHERE b.visitor=a.visitor AND b.day < a.day AND b.at >= ?)`).bind(day,start,start),
    ]);
    const rows = (i:number) => (batch[i].results || []) as Record<string, unknown>[];
    const range='day BETWEEN ? AND ? AND at>=? AND '+externalVisitorSQL();
    const sessions=`SELECT *,ROW_NUMBER() OVER(PARTITION BY session ORDER BY at,id) AS n FROM traffic_activity WHERE ${range} AND session IS NOT NULL`;
    const queries=[
      `SELECT COUNT(*) AS views,COUNT(DISTINCT visitor) AS visitors,COUNT(DISTINCT session) AS visits,SUM(CASE WHEN visitor IS NULL THEN 1 ELSE 0 END) AS unidentified FROM traffic_activity WHERE ${range}`,
      `SELECT at,page,device,country,region,city,channel,substr(visitor,1,12) AS browser,substr(session,1,12) AS session FROM traffic_activity WHERE ${range} ORDER BY at DESC,id DESC LIMIT 500`,
      `SELECT day,COUNT(*) AS views,COUNT(DISTINCT visitor) AS visitors,COUNT(DISTINCT session) AS visits FROM traffic_activity WHERE ${range} GROUP BY day ORDER BY day`,
      `SELECT page,COUNT(*) AS views FROM traffic_activity WHERE ${range} GROUP BY page ORDER BY views DESC,page`,
      `SELECT device,COUNT(*) AS visits FROM (${sessions}) WHERE n=1 GROUP BY device ORDER BY visits DESC`,
      `SELECT country,region,city,COUNT(*) AS visits FROM (${sessions}) WHERE n=1 GROUP BY country,region,city ORDER BY visits DESC`,
      // Attribution uses the first recorded page of each session, even across midnight.
      `SELECT entry_channel AS channel,COUNT(*) AS visits FROM (SELECT COALESCE((SELECT channel FROM traffic_activity b WHERE b.session=a.session ORDER BY b.at,b.id LIMIT 1),'수집 전') AS entry_channel FROM (${sessions}) a WHERE n=1) GROUP BY entry_channel ORDER BY visits DESC`,
      `SELECT action,page,COUNT(*) AS clicks FROM traffic_clicks WHERE ${range} GROUP BY action,page ORDER BY clicks DESC`,
    ];
    const extra=await env.DB.batch(queries.map(sql=>env.DB!.prepare(sql).bind(from,day,start)));
    const x=(i:number)=>(extra[i].results||[]) as Record<string,unknown>[];
    const marker=await env.DB.batch([env.DB.prepare("SELECT value FROM analytics_state WHERE key='interaction_started_at'").bind()]);
    const markerValue=(marker[0].results as {value:string}[]|undefined)?.[0]?.value||null;
    const exclusions=await env.DB.batch([env.DB.prepare("SELECT substr(key,18,12) AS browser,value AS reason FROM analytics_state WHERE key LIKE 'excluded_visitor:%' AND value!='inactive'").bind()]);
    return Response.json({day,from,days,today,earliest,generatedAt:now.toISOString(),exclusions:exclusions[0].results||[],history:rows(0),pages:x(3),activity:x(1),detail:x(0)[0],trend:x(2),presence:rows(4),active:rows(5)[0]?.count||0,devices:x(4),regions:x(5),channels:x(6),clicks:x(7),interactionStartedAt:markerValue,startedAt:rows(8)[0]?.value||null,returning:rows(9)[0]?.count||0,localPreview:localPreview(request),retentionDays:30}, {headers:{...privateHeaders,...(!localPreview(request)?{'Set-Cookie':excludedCookie()}:{})}});
  } catch {
    return Response.json({error:'집계를 불러오지 못했습니다. 잠시 후 다시 시도하세요.'},{status:503,headers:privateHeaders});
  }
}
