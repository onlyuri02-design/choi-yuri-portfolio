import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
const source=readFileSync(new URL('app/portfolio-data.ts',root),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {chapters}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
test('AW20 matches the PDF first and third photos and preserves the middle photo',()=>{
 const project=chapters.flatMap(c=>c.projects).find(p=>p.id==='aw20');
 assert.deepEqual(project.images,['/portfolio/aw20-navy-knit.jpg','/portfolio/slide-31-2.jpg','/portfolio/aw20-tonal-knit.jpg']);
 for(const file of project.images)assert.ok(existsSync(new URL('public'+file,root)),file);
});
test('YURI&YURI adds the supplied photo second and preserves all nine original photos',()=>{
 const project=chapters.flatMap(c=>c.projects).find(p=>p.id==='yuriyuri');
 assert.equal(project.images.length,10);
 assert.equal(project.images[1],'/portfolio/yuriyuri-gallery/networking-20261012.png');
 assert.equal(project.imageCaptions.length,10);
 assert.deepEqual(project.images.filter((_,i)=>i!==1),['yuriyuri-gallery/01.webp','slide-26-2.png','yuriyuri-gallery/02.webp','yuriyuri-gallery/03.webp','yuriyuri-gallery/04.webp','yuriyuri-gallery/06.webp','yuriyuri-gallery/07.webp','yuriyuri-gallery/08.webp','slide-26-1.png'].map(p=>'/portfolio/'+p));
 for(const file of project.images)assert.ok(existsSync(new URL('public'+file,root)),file);
});
