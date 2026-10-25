import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';

const liveCode = ts.transpileModule(readFileSync(new URL('../lib/analytics-live.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const liveUrl = 'data:text/javascript;base64,' + Buffer.from(liveCode).toString('base64');
const { readAnalytics, isOwner, localPreview, detailPage, deviceType,registerExclusion,registeredExclusion } = await import(liveUrl);
const code = ts.transpileModule(readFileSync(new URL('../lib/traffic.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace("'./analytics-live'",JSON.stringify(liveUrl));
const { handlePageView, handlePageEngagement, visitorToken, visitorIP, geography, kstDay } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const now = new Date('2026-10-06T12:00:00Z');
const secret = 'test-only-not-a-production-secret';
function fixture() {
  const sqlite = new DatabaseSync(':memory:');
  for (const file of readdirSync(new URL('../drizzle/', import.meta.url)).filter(f => f.endsWith('.sql')).sort()) sqlite.exec(readFileSync(new URL('../drizzle/' + file, import.meta.url), 'utf8'));
  const db = {
    prepare(sql) { return { bind(...args) { return { sql, args }; } }; },
    async batch(statements) {
      sqlite.exec('BEGIN IMMEDIATE');
      try { const result = statements.map(s => /^SELECT\b/i.test(s.sql.trim()) ? {results:sqlite.prepare(s.sql).all(...s.args)} : sqlite.prepare(s.sql).run(...s.args)); sqlite.exec('COMMIT'); return result; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
  return { sqlite, env: { DB: db, ANALYTICS_SECRET: secret }, rows: table => sqlite.prepare('SELECT * FROM ' + table).all() };
}
function request({ip = '203.0.113.8', page = '/#home', ua = 'Browser-A', headers = {}, cf = {country:'KR',region:'Seoul',city:'Seoul'}, url = 'https://yurichoi.com/api/page-view', method = 'POST', body} = {}) {
  const r = new Request(url, { method, headers: { origin: new URL(url).origin, 'content-type': 'application/json', 'user-agent': ua, ...(ip ? {'cf-connecting-ip':ip} : {}), ...headers }, ...(method === 'POST' ? {body:body ?? JSON.stringify({page})} : {}) });
  if (cf) Object.defineProperty(r, 'cf', {value:cf});
  return r;
}
test('reloads and page navigation: three views, one visitor; old counts preserved', async () => {
  const f=fixture(); f.sqlite.exec("INSERT INTO page_views_daily VALUES ('2026-10-05','/#home',21)");
  for (const page of ['/#home','/#home','/notes']) assert.equal((await handlePageView(request({page}),f.env,now)).status,204);
  assert.equal(f.rows('traffic_daily')[0].views,3); assert.equal(f.rows('traffic_daily')[0].estimated_visitors,1);
  assert.equal(f.rows('traffic_daily')[0].identified_views,3); assert.equal(f.rows('traffic_daily')[0].geo_views,3);
  assert.equal(f.rows('traffic_regions_daily')[0].estimated_visitors,1); assert.equal(f.rows('traffic_visitor_keys').length,1);
  assert.equal(f.rows('page_views_daily').find(r=>r.day==='2026-10-05').views,21);
});
test('different IP or browser is a separate estimate; repeat requests are atomic', async () => {
  const f=fixture(); await Promise.all(Array.from({length:20},()=>handlePageView(request(),f.env,now)));
  await handlePageView(request({ip:'203.0.113.9'}),f.env,now); await handlePageView(request({ua:'Browser-B'}),f.env,now);
  assert.equal(f.rows('traffic_daily')[0].views,22); assert.equal(f.rows('traffic_daily')[0].estimated_visitors,3);
});
test('Korean midnight rotates keys, purges previous key, retains aggregate', async () => {
  const f=fixture(); await handlePageView(request(),f.env,new Date('2026-10-06T14:59:59Z'));
  const first=f.rows('traffic_visitor_keys')[0].token;
  await handlePageView(request(),f.env,new Date('2026-10-06T15:00:00Z'));
  assert.equal(kstDay(new Date('2026-10-06T15:00:00Z')),'2026-10-07');
  assert.equal(f.rows('traffic_daily').length,2); assert.equal(f.rows('traffic_visitor_keys').length,1); assert.notEqual(f.rows('traffic_visitor_keys')[0].token,first);
});
test('no raw IP or browser in stored rows; token changes with secret/day', async () => {
  const f=fixture(); await handlePageView(request(),f.env,now);
  const dump=JSON.stringify(['traffic_daily','traffic_regions_daily','traffic_visitor_keys'].flatMap(t=>f.rows(t)));
  assert.ok(!dump.includes('203.0.113.8')); assert.ok(!dump.includes('Browser-A')); assert.ok(!dump.includes(secret));
  assert.match(f.rows('traffic_visitor_keys')[0].token,/^[a-f0-9]{64}$/);
  assert.notEqual(await visitorToken(secret,'2026-10-06','203.0.113.8','Browser-A'),await visitorToken(secret+'2','2026-10-06','203.0.113.8','Browser-A'));
});
test('missing IP or secret does not fabricate visitors; unavailable geo stays Unknown', async () => {
  const f=fixture(); await handlePageView(request({ip:null,cf:null}),f.env,now);
  await handlePageView(request(),{DB:f.env.DB},now);
  assert.equal(f.rows('traffic_daily')[0].views,2); assert.equal(f.rows('traffic_daily')[0].estimated_visitors,0); assert.equal(f.rows('traffic_daily')[0].identified_views,0);
  assert.equal(f.rows('traffic_visitor_keys').length,0); assert.equal(f.rows('traffic_regions_daily')[0].country,'Unknown');
});
test('privacy signals, bot and local preview cause no writes', async () => {
  const f=fixture();
  for (const options of [{headers:{dnt:'1'}},{headers:{'sec-gpc':'1'}},{ua:'Googlebot'},{url:'http://127.0.0.1:3010/api/page-view'}]) assert.equal((await handlePageView(request(options),f.env,now)).status,204);
  assert.equal(f.rows('traffic_daily').length,0); assert.equal(f.rows('page_views_daily').length,0);
});
test('reject bad origins, methods, hidden pages, oversized and malformed bodies', async () => {
  const f=fixture();
  for (const [options,status] of [[{headers:{origin:'https://other.test'}},403],[{method:'GET'},405],[{page:'/notes#note/social-stream'},400],[{body:'x'.repeat(1025)},413],[{body:'{'},400],[{headers:{'content-type':'text/plain'}},415]]) assert.equal((await handlePageView(request(options),f.env,now)).status,status);
  assert.equal(f.rows('traffic_daily').length,0);
});
test('proxy sentinel, missing/malformed/private IP and spoofed forwarded headers do not become visitors', () => {
  for(const ip of [null,'garbage','127.0.0.1','192.168.1.1','::1','2a06:98c0:3600:0:0:0:0:103']) assert.equal(visitorIP(request({ip,headers:{'x-forwarded-for':'8.8.8.8'}})),null);
  assert.equal(visitorIP(request({ip:'2001:db8:0:0:0:0:0:1'})),'2001:db8::1');
});
test('geography uses edge country fallback only with usable IP; no arbitrary city or precise location', () => {
  assert.deepEqual(geography(request({cf:null,headers:{'cf-ipcountry':'US','cf-ipcity':'Boston'}})),{country:'US',region:'Unknown',city:'Unknown'});
  assert.deepEqual(geography(request({ip:null,cf:null,headers:{'cf-ipcountry':'US'}})),{country:'Unknown',region:'Unknown',city:'Unknown'});
  assert.deepEqual(geography(request({cf:{country:'KR',region:'Seoul',city:'Seoul',latitude:37,longitude:127,postalCode:'00000'}})),{country:'KR',region:'Seoul',city:'Seoul'});
});
test('a visitor changing location keeps first-visit regional attribution', async () => {
  const f=fixture(); await handlePageView(request(),f.env,now); await handlePageView(request({cf:{country:'JP',region:'Tokyo',city:'Tokyo'}}),f.env,now);
  assert.equal(f.rows('traffic_regions_daily').find(r=>r.country==='KR').estimated_visitors,1); assert.equal(f.rows('traffic_regions_daily').find(r=>r.country==='JP').estimated_visitors,0);
});
test('probe is authenticated, does not write, and never exposes IP/token', async () => {
  const f=fixture(); assert.equal((await handlePageView(request({headers:{'x-traffic-probe':'wrong'}}),f.env,now)).status,403);
  const r=await handlePageView(request({headers:{'x-traffic-probe':secret}}),f.env,now);
  assert.deepEqual(await r.json(),{ipAvailable:true,cfMetadataAvailable:true,geography:{country:'KR',region:'Seoul',city:'Seoul'},countryHeaderAvailable:false,locationHeaderNames:[]});
  assert.equal(f.rows('traffic_daily').length,0);
});
test('database failure returns retryable error and does not set cookies', async () => {
  const f=fixture(); f.env.DB.batch=async()=>{throw Error('test failure')};
  const r=await handlePageView(request(),f.env,now); assert.equal(r.status,503); assert.equal(r.headers.get('set-cookie'),null);
});

test('engagement adds only page/day aggregates, never visitors, page views or raw identities', async () => {
  const f=fixture();
  const packet=(activeMs,starts=0,page='/#home')=>request({body:JSON.stringify({page,activeMs,starts})});
  for(const args of [[0,1],[15000,0],[7000,0],[5000,1,'/notes#note/travel']]) {
    const response=await handlePageEngagement(packet(...args),f.env,now);
    assert.equal(response.status,204); assert.equal(response.headers.get('set-cookie'),null);
  }
  const home=f.rows('page_engagement_daily').find(r=>r.page==='/#home');
  assert.equal(home.active_ms,22000); assert.equal(home.measured_views,1);
  assert.equal(home.first_recorded_at,now.toISOString());
  for(const table of ['traffic_daily','page_views_daily','traffic_visitor_keys','traffic_regions_daily']) assert.equal(f.rows(table).length,0);
  const serialized=JSON.stringify(f.rows('page_engagement_daily'));
  assert.ok(!serialized.includes('203.0.113.8')); assert.ok(!serialized.includes('Browser-A'));
});
test('engagement rejects invalid packets, methods, origins, and oversized durations', async () => {
  const f=fixture();
  for(const data of [null,{},[],{page:'/#home',activeMs:-1,starts:0},{page:'/#home',activeMs:15001,starts:0},{page:'/#home',activeMs:1.2,starts:0},{page:'/#home',activeMs:0,starts:0},{page:'/#home',activeMs:1000,starts:2},{page:'/private',activeMs:1000,starts:0}]) assert.equal((await handlePageEngagement(request({body:JSON.stringify(data)}),f.env,now)).status,400);
  for(const [options,status] of [[{headers:{origin:'https://other.test'}},403],[{method:'GET'},405],[{body:'x'.repeat(257)},413],[{body:'{'},400],[{headers:{'content-type':'text/plain'}},415]]) assert.equal((await handlePageEngagement(request(options),f.env,now)).status,status);
  assert.equal(f.rows('page_engagement_daily').length,0);
});
test('engagement honors privacy/local/bot guards and server KST date; failures are contained', async () => {
  const f=fixture(); const body=JSON.stringify({page:'/#home',activeMs:1000,starts:1});
  for(const options of [{headers:{dnt:'1'}},{headers:{'sec-gpc':'1'}},{ua:'Googlebot'},{url:'http://127.0.0.1:3010/api/page-engagement'}]) assert.equal((await handlePageEngagement(request({...options,body}),f.env,now)).status,204);
  assert.equal(f.rows('page_engagement_daily').length,0);
  await handlePageEngagement(request({body}),f.env,new Date('2026-10-06T15:00:00Z'));
  assert.equal(f.rows('page_engagement_daily')[0].day,'2026-10-07');
  assert.equal((await handlePageEngagement(request({body}),{},now)).status,503);
  f.env.DB.batch=async()=>{throw Error('unavailable');};
  assert.equal((await handlePageEngagement(request({body}),f.env,now)).status,503);
});

test('owner and opt-out cookie skip both detailed and aggregate writes', async () => {
  const f=fixture(); f.env.ANALYTICS_OWNER_EMAIL='owner@example.test';
  for(const headers of [{'oai-authenticated-user-email':'owner@example.test'},{cookie:'other=x; yc_analytics_excluded=1; next=y'}]) {
    assert.equal((await handlePageView(request({headers}),f.env,now)).status,204);
    assert.equal((await handlePageEngagement(request({headers,body:JSON.stringify({page:'/#home',activeMs:1000,starts:1})}),f.env,now)).status,204);
  }
  for(const table of ['traffic_daily','traffic_activity','traffic_presence','page_engagement_daily']) assert.equal(f.rows(table).length,0);
});
test('three route views share a session; inactivity beyond 30 minutes opens another', async () => {
  const f=fixture();
  for(const [minute,route] of [[0,'/#case/dkma'],[1,'/#case/yuriyuri'],[2,'/#case/chaeum'],[33,'/#case/chaeum']])
    await handlePageView(request({body:JSON.stringify({page:'/#case',route})}),f.env,new Date(+now+minute*60000));
  const rows=f.rows('traffic_activity');
  assert.equal(rows.length,4); assert.equal(new Set(rows.map(r=>r.visitor)).size,1);
  assert.equal(new Set(rows.slice(0,3).map(r=>r.session)).size,1); assert.notEqual(rows[2].session,rows[3].session);
  assert.equal(rows[1].page,'/#case/yuriyuri');
});
test('heartbeat updates presence, never page views or visitor totals', async () => {
  const f=fixture(), beat=request({body:JSON.stringify({page:'/#home',kind:'heartbeat'})});
  await handlePageView(request(),f.env,now);
  assert.equal((await handlePageView(beat,f.env,new Date(+now+240000))).status,204);
  assert.equal(f.rows('traffic_presence')[0].last_seen,new Date(+now+240000).toISOString());
  assert.equal(f.rows('traffic_daily')[0].views,1); assert.equal(f.rows('traffic_activity').length,1);
});
test('heartbeat alone cannot create a visitor; expired presence is not resurrected', async () => {
  const f=fixture(), beat=()=>request({body:JSON.stringify({page:'/#home',kind:'heartbeat'})});
  await handlePageView(beat(),f.env,now); assert.equal(f.rows('traffic_presence').length,0);
  await handlePageView(request(),f.env,now);
  await handlePageView(beat(),f.env,new Date(+now+31*60000));
  assert.equal(f.rows('traffic_presence')[0].last_seen,now.toISOString());
});
test('activity identifier is stable across KST days and stores no raw identity', async () => {
  const f=fixture();
  await handlePageView(request(),f.env,new Date('2026-10-06T14:59:59Z'));
  await handlePageView(request(),f.env,new Date('2026-10-06T15:00:00Z'));
  const rows=f.rows('traffic_activity'); assert.equal(rows[0].visitor,rows[1].visitor); assert.notEqual(rows[0].day,rows[1].day);
  const dump=JSON.stringify([...rows,...f.rows('traffic_presence')]);
  for(const value of ['203.0.113.8','Browser-A',secret]) assert.ok(!dump.includes(value));
});
test('30-day detail cleanup preserves daily aggregates', async () => {
  const f=fixture(); await handlePageView(request(),f.env,new Date(+now-31*86400000));
  await handlePageView(request({ip:'203.0.113.9'}),f.env,now);
  assert.equal(f.rows('traffic_activity').length,1); assert.equal(f.rows('traffic_presence').length,1);
  assert.equal(f.rows('traffic_daily').length,2);
});
test('dashboard authorization fails closed and local bypass accepts only loopback HTTP', async () => {
  const f=fixture(); f.env.ANALYTICS_OWNER_EMAIL='owner@example.test';
  for(const headers of [{},{'oai-authenticated-user-email':'someone@example.test'},{cookie:'yc_analytics_excluded=1'}])
    assert.equal((await readAnalytics(request({method:'GET',headers}),f.env,now)).status,401);
  assert.equal(isOwner(request({headers:{'oai-authenticated-user-email':'owner@example.test'}}),{}),false);
  assert.equal(localPreview(new Request('https://localhost/api/analytics')),false);
  assert.equal(localPreview(new Request('https://evil.test/api/analytics', {headers:{host:'localhost'}})),false);
  assert.equal(localPreview(new Request('http://localhost:3010/api/analytics')),true);
});
test('owner snapshot is private, coherent, pseudonymous and dates are bounded', async () => {
  const f=fixture(); await handlePageView(request(),f.env,now);
  f.env.ANALYTICS_OWNER_EMAIL='owner@example.test';
  const get=day=>request({ip:'203.0.113.99',method:'GET',url:'https://yurichoi.com/api/analytics?day='+day,headers:{'oai-authenticated-user-email':'owner@example.test'}});
  const r=await readAnalytics(get('2026-10-06'),f.env,now), data=await r.json();
  assert.equal(r.status,200); assert.match(r.headers.get('cache-control'),/private.*no-store/);
  assert.match(r.headers.get('set-cookie'),/yc_analytics_excluded=1/);
  assert.equal(data.detail.views,1); assert.equal(data.detail.visits,1); assert.equal(data.active,1);
  assert.match(data.activity[0].browser,/^[a-f0-9]{12}$/);
  assert.ok(!JSON.stringify(data).includes('203.0.113.8'));
  assert.equal((await readAnalytics(get('2026-10-07'),f.env,now)).status,400);
  assert.equal((await readAnalytics(get('2020-01-01'),f.env,now)).status,400);
  const later=await (await readAnalytics(get('2026-10-06'),f.env,new Date(+now+6*60000))).json(); assert.equal(later.active,0);
  f.env.DB.batch=async()=>{throw Error('offline')}; assert.equal((await readAnalytics(get('2026-10-06'),f.env,now)).status,503);
});
test('owner registration excludes earlier records across hosts and every dashboard breakdown',async()=>{
 const f=fixture();
 await handlePageView(request(),f.env,now);
 await handlePageView(request({body:JSON.stringify({page:'/#home',kind:'click',action:'CV 열기'})}),f.env,now);
 await handlePageView(request({ip:'203.0.113.9',ua:'Real visitor'}),f.env,now);
 f.env.ANALYTICS_OWNER_EMAIL='owner@example.test';
 const owner=request({method:'GET',url:'https://yuri-choi.yurinananana.chatgpt.site/api/analytics',headers:{'oai-authenticated-user-email':'owner@example.test'}});
 const data=await (await readAnalytics(owner,f.env,now)).json();
 assert.equal(data.detail.views,1);assert.equal(data.detail.visitors,1);assert.equal(data.active,1);
 for(const dimension of ['pages','trend','history'])assert.equal(data[dimension].reduce((n,r)=>n+r.views,0),1,dimension);
 for(const dimension of ['regions','devices','channels'])assert.equal(data[dimension].reduce((n,r)=>n+r.visits,0),1,dimension);
 assert.equal(data.clicks.length,0);assert.equal(data.activity.length,1);assert.equal(data.exclusions[0].reason,'owner');
 assert.equal(f.rows('traffic_activity').length,2,'original records retained');
 assert.equal(await registeredExclusion(request(),f.env),true);
 await handlePageView(request(),f.env,now);
 await handlePageView(request({body:JSON.stringify({page:'/#home',kind:'heartbeat'})}),f.env,now);
 await handlePageEngagement(request({body:JSON.stringify({page:'/#home',activeMs:1000,starts:1})}),f.env,now);
 assert.equal(f.rows('traffic_activity').length,2);assert.equal(f.rows('page_engagement_daily').length,0);
});
test('self exclusion survives missing cookies, updates a changed network, and is reversible',async()=>{
 const f=fixture();await handlePageView(request(),f.env,now);
 await registerExclusion(request(),f.env);
 await handlePageView(request(),f.env,now);assert.equal(f.rows('traffic_activity').length,1);
 await handlePageView(request({ip:'203.0.113.11',headers:{cookie:'yc_analytics_excluded=1'}}),f.env,now);
 assert.equal(await registeredExclusion(request({ip:'203.0.113.11'}),f.env),true);
 await registerExclusion(request(),f.env,'inactive');await handlePageView(request(),f.env,now);
 assert.equal(f.rows('traffic_activity').length,2);
});
test('server rejects hosting preview and automation even when client guards are bypassed',async()=>{
 const f=fixture();
 for(const options of [{url:'https://yuri-choi.yurinananana.chatgpt.site/api/page-view'},{ua:'Playwright Chrome'},{ua:'puppeteer'},{ua:'HeadlessChrome'},{body:JSON.stringify({page:'/#home',automated:true})}]){
  assert.equal((await handlePageView(request(options),f.env,now)).status,204);
 }
 assert.equal(f.rows('traffic_activity').length,0);
});
test('exclusion endpoints authorize mutations, register only self, and restore without deleting records',async()=>{
 const f=fixture();f.env.ANALYTICS_OWNER_EMAIL='owner@example.test';globalThis.__analyticsExclusionTestEnv=f.env;
 const load=async(name)=>{
  const source=ts.transpileModule(readFileSync(new URL('../app/api/analytics/'+name+'/route.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace(/import\s*\{\s*env\s*\}\s*from\s*['"]cloudflare:workers['"];?/, 'const env=globalThis.__analyticsExclusionTestEnv;').replace("'../../../../lib/analytics-live'",JSON.stringify(liveUrl));
  return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 };
 const self=await load('exclude-self'),admin=await load('exclusions');
 await handlePageView(request(),f.env,now);const browser=f.rows('traffic_activity')[0].visitor.slice(0,12);
 const body=JSON.stringify({browser,excluded:true});
 assert.equal((await admin.POST(request({body}))).status,401);
 assert.equal((await admin.POST(request({body,headers:{'oai-authenticated-user-email':'owner@example.test',origin:'https://evil.test'}}))).status,403);
 assert.equal((await admin.POST(request({body,headers:{'oai-authenticated-user-email':'owner@example.test'}}))).status,200);
 assert.equal(await registeredExclusion(request(),f.env),true);
 assert.equal((await admin.POST(request({body:JSON.stringify({browser,excluded:false}),headers:{'oai-authenticated-user-email':'owner@example.test'}}))).status,200);
 assert.equal(await registeredExclusion(request(),f.env),false);assert.equal(f.rows('traffic_activity').length,1);
 assert.equal((await self.POST(request({headers:{origin:'https://evil.test'}}))).status,403);
 const result=await self.POST(request({body:JSON.stringify({excluded:true})}));assert.equal(result.status,200);assert.equal((await result.json()).registered,true);
 assert.equal(await registeredExclusion(request(),f.env),true);
 await self.POST(request({body:JSON.stringify({excluded:false})}));assert.equal(await registeredExclusion(request(),f.env),false);
 delete globalThis.__analyticsExclusionTestEnv;
});
test('route details and devices are bounded and query strings are never stored', () => {
  assert.equal(detailPage('/#case','/#case/dkma?email=private@example.test'),'/#case');
  assert.equal(detailPage('/#cv','/#cv/summary'),'/#cv/summary');
  assert.equal(detailPage('/#home','/#case/dkma'),'/#home');
  assert.equal(deviceType('Mozilla iPhone Mobile'),'모바일'); assert.equal(deviceType('Android Tablet'),'태블릿'); assert.equal(deviceType('Mozilla Windows'),'데스크톱');
});

test('range totals deduplicate visitors across days and channel/device/location partition sessions',async()=>{
 const f=fixture();
 for(const [at,source,page] of [['2026-10-05T12:00:00Z','www.google.com','/#home'],['2026-10-06T12:00:00Z','www.instagram.com','/#work'],['2026-10-06T12:01:00Z','','/notes']]){
   assert.equal((await handlePageView(request({body:JSON.stringify({page,referrer:source})}),f.env,new Date(at))).status,204);
 }
 const data=await (await readAnalytics(new Request('http://localhost/api/analytics?day=2026-10-06&days=7'),f.env,now)).json();
 assert.deepEqual(data.detail,{views:3,visitors:1,visits:2,unidentified:0});
 for(const key of ['channels','devices','regions'])assert.equal(data[key].reduce((n,r)=>n+r.visits,0),2);
 assert.deepEqual(data.channels.map(r=>r.channel).sort(),['검색','소셜']);
 assert.equal(data.pages.reduce((n,r)=>n+r.views,0),3);
 assert.equal((await readAnalytics(new Request('http://localhost/api/analytics?days=999'),f.env,now)).status,400);
});

test('clicks never inflate page counts; guards and action allowlist apply',async()=>{
 const f=fixture(); await handlePageView(request(),f.env,now);
 const body=JSON.stringify({page:'/#home',kind:'click',action:'이메일 문의',email:'private@example.test'});
 assert.equal((await handlePageView(request({body}),f.env,now)).status,204);
 await handlePageView(request({body,headers:{cookie:'yc_analytics_excluded=1'}}),f.env,now);
 await handlePageView(request({body,headers:{dnt:'1'}}),f.env,now);
 assert.equal(f.rows('traffic_clicks').length,1);assert.equal(f.rows('traffic_daily')[0].views,1);
 assert.ok(!JSON.stringify(f.rows('traffic_clicks')).includes('private@example.test'));
 assert.equal((await handlePageView(request({body:JSON.stringify({page:'/#home',kind:'click',action:'arbitrary'})}),f.env,now)).status,400);
});

test('cross-midnight session keeps original attribution and legacy null is not direct',async()=>{
 const f=fixture();
 await handlePageView(request({body:JSON.stringify({page:'/#home',referrer:'naver.com'})}),f.env,new Date('2026-10-05T14:59:00Z'));
 await handlePageView(request({body:JSON.stringify({page:'/#work',referrer:''})}),f.env,new Date('2026-10-05T15:01:00Z'));
 const get=()=>readAnalytics(new Request('http://localhost/api/analytics?day=2026-10-06'),f.env,now);
 let data=await (await get()).json();assert.equal(data.channels[0].channel,'검색');assert.equal(data.detail.visits,1);
 f.sqlite.exec('UPDATE traffic_activity SET channel=NULL');
 data=await (await get()).json();assert.equal(data.channels[0].channel,'수집 전');
});
