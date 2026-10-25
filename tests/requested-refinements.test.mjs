import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import { chapters } from '../app/portfolio-data.ts';
import { extendImageBackground } from '../app/image-background.ts';

const project = id => chapters.flatMap(c => c.projects).find(p => p.id === id);
test('shared career records include the supplied credentials and showroom experience', () => {
  const contributions = project('yuriyuri').responsibilities.join('\n');
  assert.match(contributions, /2020–2023 Member of the British Fashion Council/);
  assert.match(contributions, /한국인 최초 Savile Row Academy Master Tailoring 수료/);
  assert.match(project('leadership').responsibilities.join('\n'), /파리·밀라노 쇼룸 참여 및 해외 바이어 직접 미팅/);
  assert.match(project('madeca-labs').description, /북미·영국을 포함한 유럽/);
  assert.equal(project('madeca-labs').period, 'IN DEVELOPMENT');
});
test('builder cover uses lower-positioned serif type on desktop and mobile', async () => {
  const css = await fs.readFile(new URL('../app/builder/comparison.css', import.meta.url), 'utf8');
  const names = [...css.matchAll(/\.builder-site \.cover h1\.clean-name\{([^}]+)\}/g)].map(m => m[1]);
  assert.equal(names.length, 2);
  names.forEach(rule => { assert.match(rule, /top:auto/); assert.match(rule, /bottom:/); assert.doesNotMatch(rule, /scaleX/); });
  assert.match(names[0], /font-family:"Bodoni Moda",Didot,Georgia,serif/);
});
test('photo margins extend edge colours without modifying the image source', () => {
  const previous = globalThis.document;
  const pixels = new Uint8ClampedArray(2 * 24 * 4);
  for (let row = 0; row < 24; row++) { pixels.set([20,40,60,255,80,100,120,255], row * 8); }
  globalThis.document = { createElement: () => ({ getContext: () => ({ drawImage() {}, getImageData: () => ({ data: pixels }) }) }) };
  try {
    const image = { naturalWidth: 1086, naturalHeight: 1448, src: '/original.png', parentElement: { style: {} } };
    extendImageBackground({ currentTarget: image });
    assert.equal(image.src, '/original.png');
    assert.match(image.parentElement.style.backgroundImage, /rgba\(20,40,60,1\)/);
    assert.match(image.parentElement.style.backgroundImage, /rgba\(80,100,120,1\)/);
    assert.equal(image.parentElement.style.backgroundPosition, 'left center, right center');
  } finally { globalThis.document = previous; }
});
