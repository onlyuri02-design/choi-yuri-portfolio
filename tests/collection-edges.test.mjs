import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../app/final-preview/approved-revision.css',import.meta.url),'utf8');
test('collection edge masks cover all six audited captures without blanket cropping',()=>{
  for(const file of ['32-1','32-3','33-2','34-2','34-3','34-4']){
    assert.ok(css.includes(`[src="/portfolio/slide-${file}.png"]`));
  }
  assert.match(css,/\.revision-collection \.f-gallery figure>a>img\{width:auto;max-width:100%\}/);
  assert.match(css,/\.revision-collection \.f-thumbnails img\{width:auto;height:auto;max-width:100%;max-height:100%\}/);
  assert.doesNotMatch(css,/\.revision-collection \.f-gallery img\{clip-path/);
});
