import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import ts from 'typescript';
import {parseHTML} from 'linkedom';
import vm from 'node:vm';
const root=resolve(import.meta.dirname,'..');
async function loadURL(file){
 let code=ts.transpileModule(await readFile(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 for(const match of [...code.matchAll(/from ['"](\.[^'"]+)['"]/g)])code=code.replace(match[0],`from '${await loadURL(resolve(dirname(file),match[1]+'.ts'))}'`);
 return 'data:text/javascript;base64,'+Buffer.from(code).toString('base64');
}
const {publicRoutes,findPublicRoute,routeHref}=await import(await loadURL(resolve(root,'lib/portfolio-routes.ts')));
const notes=JSON.parse(await readFile(resolve(root,'lib/notes-pages.json'),'utf8'));
test('all legacy routes resolve to canonical destinations',()=>{
 for(const route of publicRoutes)assert.equal(routeHref(route.route),route.path);
 assert.equal(routeHref('case/dkma/details'),'/case/dkma#case-details');
 assert.equal(routeHref('resume'),'/');assert.equal(routeHref('portfolio'),'/work');
 assert.equal(findPublicRoute('not-a-page'),undefined);
 assert.equal(findPublicRoute('work/details'),undefined);
});
test('all published notes have isolated article HTML, metadata and crawlable links',()=>{
 assert.equal(Object.keys(notes).length,17);
 for(const [slug,page] of Object.entries(notes)){
  const {document}=parseHTML(page.html);
  assert.equal(document.querySelector('link[rel="canonical"]').href,'https://yurichoi.com'+page.path);
  assert.equal(document.title,page.title);
  assert.ok(document.querySelector('meta[property="og:description"]').content);
  assert.equal(document.querySelectorAll('script:not([src])').length,0);
  assert.equal(document.querySelectorAll('a[href^="#note/"]').length,0);
  assert.equal(document.querySelector('[data-stream-only]'),null);
  if(slug){assert.ok(document.querySelector('#detail'));assert.equal(document.querySelector('#listing'),null);assert.ok(document.querySelector('#detail').textContent.length>300);}
 }
 assert.match(notes.fandom.html,/유명한 이름/);
 assert.match(notes['nike-heritage'].html,/최근 5년 동안 내가 산 나이키는 두 켤레/);
 assert.doesNotMatch(notes['nike-heritage'].html,/data-fandom-only/);
});
test('new paths retain old analytics keys without changing local opt-out',async()=>{
 const code=await readFile(resolve(root,'public/site-analytics.js'),'utf8');
 for(const [path,expected,detail] of [['/case/dkma','/#case','/#case/dkma'],['/cv/summary','/#cv','/#cv/summary'],['/notes/fandom','/notes#note/fandom','/notes#note/fandom'],['/process/decision','/#process','/#process/decision']]){
  const sent=[];const window={addEventListener(){}};const document={cookie:'',referrer:'',visibilityState:'visible',readyState:'complete',addEventListener(){},getElementById(){return {hidden:false}},createElement(){return{}},head:{appendChild(){}}};
  vm.runInNewContext(code,{window,document,location:{pathname:path,hash:'',hostname:'yurichoi.com'},localStorage:{removeItem(){},getItem(){return null}},navigator:{},getComputedStyle(){return{display:'block'}},setTimeout(fn){fn()},clearTimeout(){},fetch(_url,request){sent.push(JSON.parse(request.body));return Promise.resolve()},URL,Date,...{}} ,{timeout:1000});
  assert.equal(window.__ycEngagementPageKey(),expected);assert.equal(sent[0].route,detail);
 }
});
const origin=process.env.TEST_ORIGIN;
test('every public route returns its actual HTML before JavaScript, with correct metadata',{skip:!origin},async()=>{
 const paths=[...publicRoutes,...Object.values(notes)];
 for(const route of paths){
  const response=await fetch(origin+route.path);assert.equal(response.status,200,route.path);
  const {document}=parseHTML(await response.text());document.querySelectorAll('script').forEach(s=>s.remove());
  assert.equal(document.title,route.title,route.path+' title');
  assert.equal(document.querySelector('link[rel="canonical"]')?.href,'https://yurichoi.com'+route.path,route.path+' canonical');
  const main=document.querySelector('main');assert.ok(main?.textContent.length>100,route.path+' body');
  if(route.path!=='/')assert.ok(!main.textContent.includes('Hello, I’m Yuri.'),route.path+' is not home fallback');
  for(const a of main.querySelectorAll('a[href]'))assert.ok(!/^#(?:work|case|project|cv|process|note)\b/.test(a.getAttribute('href')),route.path+' legacy link');
 }
 assert.equal((await fetch(origin+'/notes/not-a-note')).status,404);
 assert.equal((await fetch(origin+'/not-a-page')).status,404);
 // Owner-only authorization is covered by traffic.test.mjs; loopback has an explicit preview bypass.
 console.log('Verified initial HTML for '+paths.length+' public routes.');
});
