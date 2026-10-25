import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { chapters } from '../app/portfolio-data.ts';
const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
const project=id=>chapters.flatMap(c=>c.projects).find(p=>p.id===id);
test('all images from slides 48–50 are mapped, with unchanged source bytes',async()=>{
  const manifest=JSON.parse(await read('work/business-image-manifest.json'));
  assert.equal(manifest.length,9);
  for(const item of manifest){const p=project(item.slide===48?'leadership':'business-strategy');assert.ok(p.images.includes('/portfolio/'+item.file));const b=await fs.readFile(new URL('../public/portfolio/'+item.file,import.meta.url));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),item.sha256)}
  assert.equal(project('business-strategy').images.length,2);
  assert.equal(project('leadership').images.length,7);
  assert.match(project('leadership').images[0],/_59\.jpg$/);
  assert.ok(project('leadership').imageCaptions.slice(1,5).every(c=>c.includes('인물')));
  assert.ok(project('leadership').imageCaptions.slice(5).every(c=>/의류|니트웨어/.test(c)));
});
test('P&L replaces the empty image plate with four process steps and four decisions',async()=>{
  const source=await read('app/pnl-diagram.tsx'),view=await read('app/portfolio-explorer.tsx'),css=await read('app/pnl-diagram.css');
  assert.equal((source.match(/  \{title:/g)||[]).length,8);
  for(const formula of ['Volume × ASP','Revenue − COGS','Gross profit − OPEX','고정비 ÷ 단위당 공헌이익'])assert.ok(source.includes(formula));
  assert.match(view,/project.id==="profitability"\?<PnlDiagram\/>/);
  assert.match(css,/@container pnl/);assert.match(css,/@media\(max-width:700px\)/);
  assert.ok(source.includes('각 비용은 한 번만 반영'));
});
