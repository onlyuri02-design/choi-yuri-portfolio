import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { chapters } from '../app/portfolio-data.ts';
const projects=chapters.flatMap(c=>c.projects);
test('all individual images from current pages 26–35 are mapped and unmodified',async()=>{
 const manifest=JSON.parse(await fs.readFile(new URL('../work/additions-manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.length,24);
 assert.equal(manifest.filter(a=>!a.duplicate).length,21);
 const used=new Set(projects.flatMap(p=>p.images));
 for(const asset of manifest){
   assert.ok(used.has('/portfolio/'+asset.file),asset.file);
   const bytes=await fs.readFile(new URL('../public/portfolio/'+asset.file,import.meta.url));
   assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256);
 }
});
test('new archives live in fashion with matching individual captions',()=>{
 const fashion=chapters.find(c=>c.id==='fashion');
 for(const id of ['master-tailoring','vip-clients','celebrity-editorial'])assert.ok(fashion.projects.some(p=>p.id===id));
 for(const p of projects)if(p.imageCaptions)assert.equal(p.images.length,p.imageCaptions.length,p.id);
 assert.equal(projects.find(p=>p.id==='global-retail').images.length,7);
 assert.equal(projects.find(p=>p.id==='master-tailoring').images.length,5);
 assert.equal(projects.find(p=>p.id==='vip-clients').images.length,6);
 assert.equal(projects.find(p=>p.id==='celebrity-editorial').images.length,6);
});
