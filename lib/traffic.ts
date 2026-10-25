import { acquisition, clickActions, activityStatements, detailPage, deviceType, isExcluded, privateVisitor, visitorIP, productionHosts, automatedAgent, registeredExclusion, registerExclusion } from './analytics-live';
export { visitorIP };

export type TrafficEnv = { DB?: D1Database; ANALYTICS_SECRET?: string; ANALYTICS_OWNER_EMAIL?: string };
type EdgeRequest = Request & { cf?: { country?: unknown; region?: unknown; city?: unknown } };
const noStore = { 'Cache-Control': 'no-store' };
const origins = ['https://yurichoi.com', 'https://www.yurichoi.com', 'https://yuri-choi.yurinananana.chatgpt.site'];
const pages = new Set([
  '/#home', '/#work', '/#process', '/#press', '/#cv', '/#project', '/#case', '/notes',
  ...['travel','tailoring','fandom','fragrance','alpha','alpha-offline','beauty','vacation','grinder','fashion','beetle','lemme','trend','glp1-fashion','ai-wellness','nike-heritage'].map(id => '/notes#note/' + id),
]);
export const kstDay = (now: Date) => new Date(now.getTime() + 9 * 3600000).toISOString().slice(0, 10);

// Edge-owned headers only, never client-submitted IDs or X-Forwarded-For.

export function geography(request: EdgeRequest) {
  // Country can also be supplied by Cloudflare's IP geolocation header when
  // the hosting dispatcher drops Request.cf. Never use arbitrary city headers.
  const cf = request.cf;
  const candidate = cf?.country || (visitorIP(request) ? request.headers.get('cf-ipcountry') : null);
  const country = typeof candidate === 'string' && /^[A-Z]{2}$/.test(candidate) && !['XX','T1'].includes(candidate) ? candidate : 'Unknown';
  const clean = (value: unknown) => country !== 'Unknown' && typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 100) || 'Unknown' : 'Unknown';
  return { country, region: clean(cf?.region), city: clean(cf?.city) };
}

export async function visitorToken(secret: string, day: string, ip: string, userAgent: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(JSON.stringify(['yurichoi.com', day, ip, userAgent.slice(0, 512)])));
  return Array.from(new Uint8Array(signed), n => n.toString(16).padStart(2, '0')).join('');
}

export async function recordTraffic(db: D1Database, day: string, page: string, token: string | null, geo: ReturnType<typeof geography>, now: Date, detail: {page:string; visitor:string|null; device:string; channel?:string}) {
  // One atomic D1 transaction. Both counters test the key BEFORE insertion.
  const fresh = 'CASE WHEN ? IS NOT NULL AND NOT EXISTS (SELECT 1 FROM traffic_visitor_keys WHERE day = ? AND token = ?) THEN 1 ELSE 0 END';
  await db.batch([
    db.prepare('DELETE FROM traffic_visitor_keys WHERE day < ?').bind(day),
    db.prepare('INSERT INTO page_views_daily (day, page, views) VALUES (?, ?, 1) ON CONFLICT(day, page) DO UPDATE SET views = views + 1').bind(day, page),
    db.prepare(`INSERT INTO traffic_daily (day, views, identified_views, geo_views, estimated_visitors, first_recorded_at) VALUES (?, 1, ?, ?, ${fresh}, ?) ON CONFLICT(day) DO UPDATE SET views = views + 1, identified_views = identified_views + excluded.identified_views, geo_views = geo_views + excluded.geo_views, estimated_visitors = estimated_visitors + excluded.estimated_visitors`).bind(day, token ? 1 : 0, geo.country === 'Unknown' ? 0 : 1, token, day, token, now.toISOString()),
    db.prepare(`INSERT INTO traffic_regions_daily (day, country, region, city, views, estimated_visitors) VALUES (?, ?, ?, ?, 1, ${fresh}) ON CONFLICT(day, country, region, city) DO UPDATE SET views = views + 1, estimated_visitors = estimated_visitors + excluded.estimated_visitors`).bind(day, geo.country, geo.region, geo.city, token, day, token),
    db.prepare('INSERT OR IGNORE INTO traffic_visitor_keys (day, token) SELECT ?, ? WHERE ? IS NOT NULL').bind(day, token, token),
    ...activityStatements(db,now,day,detail.page,detail.visitor,detail.device,geo,detail.channel),
  ]);
}

export async function handlePageView(request: EdgeRequest, env: TrafficEnv, now = new Date()): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...noStore, Allow: 'POST' } });
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  const local = ['localhost','127.0.0.1'].includes(url.hostname);
  if (!origin || !(origins.includes(origin) || (local && origin === url.origin))) return new Response(null, { status: 403, headers: noStore });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 415, headers: noStore });
  if (Number(request.headers.get('content-length') || 0) > 1024) return new Response(null, { status: 413, headers: noStore });
  const raw = await request.text();
  if (raw.length > 1024) return new Response(null, { status: 413, headers: noStore });
  let page: unknown, route: unknown, kind: unknown, referrer: unknown, action: unknown, automated:unknown;
  try { const payload = JSON.parse(raw); page = payload.page; route = payload.route; kind = payload.kind; referrer=payload.referrer; action=payload.action; automated=payload.automated; } catch { return new Response(null, { status: 400, headers: noStore }); }
  if (typeof page !== 'string' || !pages.has(page)) return new Response(null, { status: 400, headers: noStore });
  if (kind !== undefined && kind !== 'heartbeat' && kind !== 'click') return new Response(null, {status:400,headers:noStore});
  if (kind==='click' && (typeof action!=='string'||!clickActions.has(action))) return new Response(null,{status:400,headers:noStore});
  const ip = local ? null : visitorIP(request);
  const geo = local ? { country: 'Unknown', region: 'Unknown', city: 'Unknown' } : geography(request);
  // Secret-authenticated, no-write diagnostic. Never returns IP/token/headers.
  const probe = request.headers.get('x-traffic-probe');
  if (probe) {
    if (!env.ANALYTICS_SECRET || probe !== env.ANALYTICS_SECRET) return new Response(null, { status: 403, headers: noStore });
    return Response.json({ ipAvailable: !!ip, cfMetadataAvailable: !!request.cf, geography: geo, countryHeaderAvailable: !!request.headers.get('cf-ipcountry'), locationHeaderNames: Array.from(request.headers.keys()).filter(name => /country|city|region|location/i.test(name)) }, { headers: noStore });
  }
  const userAgent = request.headers.get('user-agent') || '';
  if (local || !productionHosts.has(url.hostname) || !productionHosts.has(new URL(origin).hostname) || automated===true || request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1' || automatedAgent(userAgent)) return new Response(null, { status: 204, headers: noStore });
  if (!env.DB) return new Response(null, { status: 503, headers: noStore });
  try {
    if(isExcluded(request,env)){await registerExclusion(request,env);return new Response(null,{status:204,headers:noStore});}
    if(await registeredExclusion(request,env))return new Response(null,{status:204,headers:noStore});
    const day = kstDay(now);
    const token = ip && userAgent && env.ANALYTICS_SECRET ? await visitorToken(env.ANALYTICS_SECRET, day, ip, userAgent) : null;
    const visitor = ip && userAgent && env.ANALYTICS_SECRET ? await privateVisitor(env.ANALYTICS_SECRET,ip,userAgent) : null;
    if (kind==='click') {
      await env.DB.batch([
        env.DB.prepare('DELETE FROM traffic_clicks WHERE at < ?').bind(new Date(now.getTime()-30*86400000).toISOString()),
        env.DB.prepare("INSERT OR IGNORE INTO analytics_state (key,value) VALUES ('interaction_started_at',?)").bind(now.toISOString()),
        env.DB.prepare('INSERT INTO traffic_clicks (id,day,at,visitor,session,page,action) VALUES (?,?,?,?,(SELECT session FROM traffic_presence WHERE visitor=? AND last_seen>=?),?,?)').bind(crypto.randomUUID(),day,now.toISOString(),visitor,visitor,new Date(now.getTime()-30*60000).toISOString(),detailPage(page,route),action as string),
      ]);
      return new Response(null,{status:204,headers:noStore});
    }
    if (kind === 'heartbeat') {
      if (visitor) await env.DB.batch([env.DB.prepare('UPDATE traffic_presence SET last_seen=?,page=? WHERE visitor=? AND last_seen>=?').bind(now.toISOString(),detailPage(page,route),visitor,new Date(now.getTime()-30*60000).toISOString())]);
      return new Response(null,{status:204,headers:noStore});
    }
    await recordTraffic(env.DB, day, page, token, geo, now, {page:detailPage(page,route),visitor,device:deviceType(userAgent),channel:acquisition(referrer)});
    return new Response(null, { status: 204, headers: noStore });
  } catch {
    // Do not log request data or exception contents.
    return new Response(null, { status: 503, headers: noStore });
  }
}

// Separate endpoint: engagement packets must never increment visitor/page counts.
export async function handlePageEngagement(request: Request, env: TrafficEnv, now = new Date()): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...noStore, Allow: 'POST' } });
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  const local = ['localhost', '127.0.0.1'].includes(url.hostname);
  if (!origin || !(origins.includes(origin) || (local && origin === url.origin))) return new Response(null, { status: 403, headers: noStore });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 415, headers: noStore });
  if (Number(request.headers.get('content-length') || 0) > 256) return new Response(null, { status: 413, headers: noStore });
  const raw = await request.text();
  if (raw.length > 256) return new Response(null, { status: 413, headers: noStore });
  let payload: { page?: unknown; activeMs?: unknown; starts?: unknown } | null;
  try { payload = JSON.parse(raw); } catch { return new Response(null, { status: 400, headers: noStore }); }
  const page = payload?.page;
  const activeMs = payload?.activeMs;
  const starts = payload?.starts;
  if (typeof page !== 'string' || !pages.has(page) || typeof activeMs !== 'number' || !Number.isInteger(activeMs) || activeMs < 0 || activeMs > 15000 || (starts !== 0 && starts !== 1) || (activeMs === 0 && starts === 0)) {
    return new Response(null, { status: 400, headers: noStore });
  }
  const ua = request.headers.get('user-agent') || '';
  if (local || !productionHosts.has(url.hostname) || !productionHosts.has(new URL(origin).hostname) || request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1' || automatedAgent(ua)) return new Response(null, { status: 204, headers: noStore });
  if (!env.DB) return new Response(null, { status: 503, headers: noStore });
  try {
    if(isExcluded(request,env)){await registerExclusion(request,env);return new Response(null,{status:204,headers:noStore});}
    if(await registeredExclusion(request,env))return new Response(null,{status:204,headers:noStore});
    // Date is assigned by the server (Asia/Seoul), never a client timestamp.
    const at = now.toISOString();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO page_engagement_daily (day, page, active_ms, measured_views, first_recorded_at, last_recorded_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(day, page) DO UPDATE SET active_ms = active_ms + excluded.active_ms, measured_views = measured_views + excluded.measured_views, last_recorded_at = excluded.last_recorded_at').bind(kstDay(now), page, activeMs, starts, at, at),
    ]);
    return new Response(null, { status: 204, headers: noStore });
  } catch {
    return new Response(null, { status: 503, headers: noStore });
  }
}
