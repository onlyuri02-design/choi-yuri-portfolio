import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const compiled=ts.transpileModule(read('app/final-preview/company-archives.ts'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {companyArchives,companyArchiveFor}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
test('company archive order follows the approved medical and beauty lists',()=>{
 assert.deepEqual(companyArchives.medical.map(g=>g.ids),[['dkma','bellast','kablelyn','bienox','millifit','fillroad','inable','dehyve','madekiel','inhilo'],['chaeum','botulax','blue-rose']]);
 assert.deepEqual(companyArchives.beauty.map(g=>g.ids),[['madeca-md','madeca-labs'],['wellage']]);
 assert.equal(companyArchiveFor('dkma').href,'/work/medical/dongkook');
 assert.equal(companyArchiveFor('blue-rose').href,'/work/medical/hugel');
 assert.equal(companyArchiveFor('madeca-md').href,'/work/beauty/dongkook');
 assert.equal(companyArchiveFor('yuriyuri'),null);
});
test('public text has no absolute revenue, target or budget amounts',()=>{
 const visit=dir=>{for(const entry of readdirSync(new URL(dir,root),{withFileTypes:true})){const path=dir+entry.name;if(entry.isDirectory())visit(path+'/');else if(/\.(tsx?|json|html)$/.test(path))assert.doesNotMatch(read(path),/(?:\d[\d.,–—-]*\s*억\s*원?|₩\s*\d|KRW\s*\d)/,path);}};
 visit('app/');
});
test('approved brand spellings are retained without changing old project links',()=>{
 const data=read('app/portfolio-data.ts');
 assert.match(data,/id:"chaeum",title:"THE CHAEUM"/);
 assert.match(data,/id:"blue-rose",title:"BELUROSE"/);
 assert.match(data,/id:"inhilo",title:"INHILO"/);
});

test('medical event index hides only the selected duplicate DKMA symposium',()=>{
 const portfolio=read('app/final-preview/portfolio.tsx');
 assert.ok(portfolio.includes("projects.filter(p=>p.id!=='dkma-symposium').map(p=>p.id)"));
 const data=ts.transpileModule(read('app/portfolio-data.ts'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
 return import('data:text/javascript;base64,'+Buffer.from(data).toString('base64')).then(({chapters})=>{
   const events=chapters.find(c=>c.id==='events').projects;
   assert.deepEqual(events.filter(p=>p.id!=='dkma-symposium').map(p=>p.id),['kablelyn-event','dkma-seoul','dkma-busan','bienox-event']);
   assert.ok(events.find(p=>p.id==='dkma-symposium'), 'detail archive remains recoverable');
 });
});
