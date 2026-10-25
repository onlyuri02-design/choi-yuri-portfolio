import assert from 'node:assert/strict';
import {readFile, readdir, access} from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
async function loadData(path){
 const compiled=ts.transpileModule(await read(path),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
 return import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
}
async function files(path){
 const entries=await readdir(new URL(path+'/',root),{withFileTypes:true});
 return (await Promise.all(entries.map(entry=>entry.isDirectory()?files(path+'/'+entry.name):path+'/'+entry.name))).flat();
}

test('root serves the approved portfolio, not the starter skeleton',async()=>{
 assert.match(await read('app/page.tsx'),/from ['"]\.\/final-preview\/page['"]/);
 const layout=await read('app/layout.tsx');
 assert.match(layout,/Yuri Choi/);
 assert.match(layout,/lang="ko"/);
 assert.doesNotMatch(layout,/Starter Project|Your site is taking shape|codex-preview/);
});

test('production Worker has a fetch entry and preserves the Site identity',async()=>{
 const entry=await read('dist/server/index.js');
 assert.match(entry,/fetch\(/);
 assert.match(entry,/export\s*\{[^}]*\bas default\b/);
 const source=JSON.parse(await read('.openai/hosting.json'));
 const built=JSON.parse(await read('dist/.openai/hosting.json'));
 assert.deepEqual(built,source);
 assert.equal(built.project_id,'appgprj_6a683cafc11081919b0cc286cb4d5a4f');
});

test('project galleries and press assets are included in public build output',async()=>{
 const {chapters}=await loadData('app/portfolio-data.ts');
 const {press}=await loadData('app/press-data.ts');
 const assets=new Set([...chapters.flatMap(c=>c.projects.flatMap(p=>p.images)),...press.flatMap(p=>[p.image,p.fallback])]);
 assert.ok(assets.size>100);
 for(const asset of assets){assert.ok(asset.startsWith('/'));await access(new URL('dist/client'+asset,root));}
 for(const image of ['context','portfolio','execution','decisions'])await access(new URL('dist/client/portfolio/ai-leadership/'+image+'-slide46.png',root));
});

test('client output excludes local state, private CV files, and source maps',async()=>{
 const publicFiles=await files('dist/client');
 assert.ok(publicFiles.some(f=>f.endsWith('.js')));
 for(const file of publicFiles){
  assert.doesNotMatch(file,/(?:^|\/)(?:\.env[^/]*|\.dev\.vars[^/]*|\.git|\.preview-temp|node_modules|work)(?:\/|$)/);
  assert.doesNotMatch(file,/\.(?:pdf|map|pem|key|sqlite|db)$/i);
 }
 for(const file of publicFiles.filter(f=>f.endsWith('.js'))){
  const code=await read(file);
  assert.doesNotMatch(code,/CV_PASSWORD_HASH|CV_FILE_KEY|Your site is taking shape/);
 }
});

test('AI shared workflow appears only in the foundation and keeps approved imagery',async()=>{
 const page=await read('app/final-preview/ai-workflow.tsx');
 const overview=await read('app/final-preview/ai-workflow-overview.tsx');
 assert.equal((page.match(/AI IN MY WORKFLOW/g)||[]).length,1);
 assert.ok(page.indexOf('AI IN MY WORKFLOW')>page.indexOf('className="al-shared-copy"'));
 assert.doesNotMatch(overview,/AI IN MY WORKFLOW|WORK BRIEF|디자인 예시/);
 for(const image of ['context','portfolio','execution','decisions'])assert.ok(overview.includes(image+'-slide46.png'));
 assert.doesNotMatch(page,/className="al-reference"|className="al-output"/);
});

test('legacy draft URLs redirect only in production while source remains available',async()=>{
 const {default:config}=await loadData('next.config.ts');
 const previous=process.env.NODE_ENV;
 try{
  process.env.NODE_ENV='production';
  const redirects=await config.redirects();
  assert.deepEqual(redirects.map(r=>r.source),['/builder','/compare','/process-options','/final-preview']);
  assert.ok(redirects.every(r=>r.destination==='/'&&r.permanent===false));
  process.env.NODE_ENV='development';
  assert.deepEqual(await config.redirects(),[]);
 }finally{if(previous===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=previous;}
});
