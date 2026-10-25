import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
test('B editorial layer follows existing CSS without replacing A',async()=>{
  const page=await read('app/builder/page.tsx');
  assert.ok(page.indexOf('import "./editorial.css"')>page.indexOf('import "./comparison.css"'));
  assert.doesNotMatch(page,/extendImageBackground|indexHref="#index" extendBackground/);
  const css=await read('app/builder/editorial.css');
  assert.match(css,/--font-display:"Bodoni Moda",var\(--font-korean\)/);
  assert.match(css,/--font-body:"Helvetica Neue",Helvetica,Arial,var\(--font-korean\)/);
  assert.match(css,/--font-korean:"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif/);
  assert.match(css,/--font-accent:"Instrument Serif",var\(--font-korean\)/);
  assert.match(css,/\.builder-site \.dark,[^{]+\{background:#fff;color:var\(--black\)/);
  assert.match(css,/\.builder-site \.contact\{[^}]*background:#fff/);
  assert.match(css,/\.builder-site \.builder-metrics strong\{[^}]*font-weight:600/);
});
test('photo surfaces use intrinsic height and fill width, including mobile',async()=>{
  const css=await read('app/builder/editorial.css');
  assert.match(css,/\.builder-site \.chapter \.project-gallery figure>a\{[^}]*width:100%;height:auto;max-height:none;background:none/);
  assert.match(css,/\.builder-site \.chapter \.project-gallery figure img\{[^}]*width:100%;height:auto;max-height:none;object-fit:cover/);
  assert.match(css,/\.builder-site \.case-visual img\{[^}]*width:100%;height:auto/);
  assert.doesNotMatch(css,/object-fit:contain/);
  assert.match(css,/@media\(max-width:900px\)/);
});
