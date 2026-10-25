import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import test from 'node:test';
import { stripTypeScriptTypes } from 'node:module';
const source=async p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
const contentCode=stripTypeScriptTypes(await source('app/builder/content.ts')).replace('"../portfolio-data"',JSON.stringify(new URL('../app/portfolio-data.ts',import.meta.url).href));
const {featured,experience}=await import('data:text/javascript;base64,'+Buffer.from(contentCode).toString('base64'));
test('editorial resume design remains unchanged',async()=>{
  for(const [p,hash]of [['app/page.tsx','452347ec239982ee9ede0779f69375b2a4a84fcc0331cf61a73d8b12479be975'],['app/globals.css','f38f1b34643ebb66b92223d675540fabeb78ec7740f3a58d493f9f274502d9a9']]){
    assert.equal(crypto.createHash('sha256').update(await source(p)).digest('hex'),hash,p);
  }
});
test('cover contains only the selected digital texture and name',async()=>{
  const page=await source('app/builder/page.tsx');
  const cover=page.match(/<section className="cover"[\s\S]*?<\/section>/)[0];
  assert.match(cover,/src="\/cover-digital-texture.jpg"/);
  assert.match(cover,/>YURI CHOI<\/h1>/);
  assert.doesNotMatch(cover,/cover-frame|cover-city|cover-role|cover-index|CONSTRAINT|VOL\./);
  assert.equal((cover.match(/<img /g)||[]).length,1);
});
test('both views use the same product archive and press data',async()=>{
  const page=await source('app/builder/page.tsx');
  assert.match(page,/chapters.*from "\.\.\/portfolio-data"/);
  assert.match(page,/<MediaPress\/>/);
  assert.match(page,/indexHref="#index"/);
  assert.equal(featured.length,5);
  assert.equal(experience[2][0],'2014 — 2017');
});
test('comparison supports resume, builder and split views without changing either page',async()=>{
  const page=await source('app/compare/page.tsx');
  assert.match(page,/src="\/"/);assert.match(page,/src="\/builder"/);
  assert.match(page,/"both"/);assert.match(page,/aria-pressed/);
});
test('template stylesheet is namespaced instead of replacing the resume theme',async()=>{
  const css=await source('app/builder/builder.css');
  assert.match(css,/\.builder-site \.section-head/);
  assert.doesNotMatch(css,/(^|\})\s*:root\{/);
  assert.doesNotMatch(css,/@import "tailwindcss"/);
});
