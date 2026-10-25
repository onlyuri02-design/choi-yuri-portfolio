import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { chapters } from '../app/portfolio-data.ts';
test('loungewear includes current slides 45–46 in order and preserves the existing detail shot',async()=>{
  const assets=JSON.parse(await fs.readFile(new URL('../work/lounge-manifest.json',import.meta.url),'utf8'));
  const lounge=chapters.find(c=>c.id==='fashion').projects.find(p=>p.id==='lounge');
  assert.equal(assets.length,5);
  assert.equal(assets.filter(a=>!a.duplicate).length,3);
  assert.deepEqual(lounge.images.slice(0,5),assets.map(a=>'/portfolio/'+a.file));
  assert.equal(lounge.images[5],'/portfolio/slide-36-3.png');
  assert.equal(new Set(lounge.images).size,6);
  for(const asset of assets){
    const bytes=await fs.readFile(new URL('../public/portfolio/'+asset.file,import.meta.url));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256);
  }
});
