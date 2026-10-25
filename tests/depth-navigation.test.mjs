import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { chapters } from '../app/portfolio-data.ts';
import { press } from '../app/press-data.ts';
const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');

test('all 101 current slide images are linked to projects without modifying source bytes',async()=>{
  const manifest=JSON.parse(await read('work/current-image-manifest.json'));
  assert.equal(manifest.length,101);assert.equal(manifest.filter(x=>x.added).length,13);
  const used=new Set(chapters.flatMap(c=>c.projects.flatMap(p=>p.images)));
  for(const a of manifest){assert.ok(used.has('/portfolio/'+a.file),`unmapped: ${a.slide} ${a.file}`);const bytes=await fs.readFile(new URL('../public/portfolio/'+a.file,import.meta.url));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256)}
  for(const c of chapters)for(const p of c.projects){if(p.imageCaptions)assert.equal(p.imageCaptions.length,p.images.length,p.id);for(const img of p.images)await fs.access(new URL('../public'+img,import.meta.url))}
});
test('fashion index groups every project exactly once, and showroom archives retain their seasons',async()=>{
  const source=await read('app/portfolio-explorer.tsx');
  const groups=source.slice(source.indexOf('const definitions=['),source.indexOf('] as const;'));
  const projects=chapters.find(c=>c.id==='fashion').projects;
  for(const p of projects)assert.equal(groups.split('"'+p.id+'"').length-1,1,p.id);
  assert.equal(projects.find(p=>p.id==='showroom-london').images.length,5);
  assert.equal(projects.find(p=>p.id==='showroom-paris').images.length,7);
  assert.equal(projects.find(p=>p.id==='showroom-paris').period,'SS2022');
});
test('cover, resume pages, category controls and motion preferences remain accessible',async()=>{
  const page=await read('app/builder/page.tsx'),resume=await read('app/resume.tsx'),explorer=await read('app/portfolio-explorer.tsx'),css=await read('app/builder/depth.css');
  assert.match(page,/selected-name/);assert.match(page,/name-cursor" aria-hidden="true"/);
  assert.match(page,/aria-controls="resume"/);assert.match(page,/aria-controls="portfolio"/);
  assert.match(page,/className="site-index"/);assert.match(page,/<PortfolioExplorer\/>/);
  assert.equal((resume.match(/role="tabpanel"/g)||[]).length,2);assert.match(resume,/ArrowRight/);
  assert.match(explorer,/aria-expanded/);assert.match(explorer,/hidden=\{open!==c.id\}/);assert.match(explorer,/history.pushState/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/grid-template-columns:1fr 1fr/);
  assert.equal(press.length,15);assert.equal(new Set(press.map(p=>p.url)).size,15);
});
