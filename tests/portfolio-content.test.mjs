import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';
import { chapters } from '../app/portfolio-data.ts';
import { press } from '../app/press-data.ts';

test('portfolio contains all five chapters with unique project targets',()=>{
  assert.deepEqual(chapters.map(c=>c.id),['medical','beauty','fashion','business','events']);
  const ids=chapters.flatMap(c=>[c.id,...c.projects.map(p=>p.id)]);
  assert.equal(new Set(ids).size,ids.length);
  for(const c of chapters)for(const p of c.projects){assert.ok(p.title);assert.ok(p.description);assert.ok(p.responsibilities.length);}
});
test('all individual source images and press thumbnails exist',async()=>{
  const paths=new Set([...chapters.flatMap(c=>c.projects.flatMap(p=>p.images)),...press.flatMap(p=>[p.image,p.fallback])]);
  for(const path of paths)await access(new URL('../public'+path,import.meta.url));
  assert.equal(chapters.flatMap(c=>c.projects.flatMap(p=>p.images)).filter(p=>p.includes('slide-')).length>=66,true);
});
test('press preserves 15 distinct links and corrected product mapping',()=>{
  assert.equal(press.length,15);assert.equal(new Set(press.map(p=>p.url)).size,15);
  for(const p of press){assert.equal(new URL(p.url).protocol,'https:');assert.ok(p.summary);assert.ok(!p.url.includes('...'));}
  assert.ok(press.find(p=>p.url.includes('208652')).title.includes('밀리핏'));
  assert.ok(press.find(p=>p.url.includes('35176')).title.includes('인힐로'));
  assert.ok(press.find(p=>p.publisher==='JOBPLANET').verification);
});
test('resume preserves two pages, latest employment period, and real HTML typography',async()=>{
  const html=await readFile(new URL('../app/page.tsx',import.meta.url),'utf8');
  assert.equal((html.match(/<PageFoot page=/g)||[]).length,2);
  assert.match(html,/2014 — 2017/);assert.match(html,/<h1 id="name">YURI/);
  assert.doesNotMatch(html,/cover-seoul|generated_images/);
});
test('all 66 extracted Google Slides images are mapped into portfolio projects',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../work/slide-assets.json',import.meta.url),'utf8'));
  assert.equal(manifest.length,66);
  const actual=new Set(chapters.flatMap(c=>c.projects.flatMap(p=>p.images)));
  for(const item of manifest){assert.ok(actual.has('/portfolio/'+item.name)||actual.has('/portfolio/'+item.name.replace(/jpg$/,'png')),item.name);}
});
