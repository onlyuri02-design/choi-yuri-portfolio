import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const read = p => readFile(new URL('../' + p, import.meta.url), 'utf8');
async function load(p) {
  const code = ts.transpileModule(await read(p), {compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
  return (await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))).default;
}
test('Nike note is added without removing existing notes and its script parses', async () => {
  const base = (await load('app/notes/alpha-offline.ts'))(await load('app/notes/document.ts'));
  const html = (await load('app/notes/nike-heritage.ts'))(base);
  assert.equal((html.match(/data-topic=/g) || []).length, (base.match(/data-topic=/g) || []).length + 1);
  assert.match(html, /data-topic="brand" data-note="nike-heritage"/);
  assert.match(html, /data-nike-only/);
  assert.match(html, /최근 5년 동안 내가 산 나이키는 두 켤레가 전부다\. 에어리프트와 샥스\. 둘 다 디자인 때문에 샀다\./);
  assert.match(html, /10~15년 전만 해도 달랐다\. 웨이트 트레이닝을 할 때 신고 입던 건 모두 나이키였다\./);
  assert.match(html, /운동과 관련된 건 고민 없이 나이키를 골랐다\.<\/p>\s*<p>지금 내 옷장에 남은 나이키는 운동을 위한 것이 아니다\./);
  assert.match(html, /다시 내 옷장으로 돌아온다\. 10~15년 전, 나에게 나이키는 운동하는 나를 위한 브랜드였다\./);
  assert.match(html, /하지만 운동복을 고를 때, 나는 더 이상 나이키부터 떠올리지 않는다\./);
  assert.match(html, /10여 년 전 나의 운동복은 모두 나이키였다\. 최근 5년, 나는 디자인 때문에 두 켤레를 샀고, 거기서 멈췄다\./);
  assert.doesNotMatch(html, /다시 내 두 켤레로 돌아온다|더 아이러니한 건 내가 나이키를 산 이유가|나에게는 나이키 운동화가 두 켤레 있다/);
  assert.match(html, /소비자는 새로운 나이키를 자신이 기억하는 가장 좋았던 나이키와 비교한다\.<\/p>/);
  assert.match(html, /브랜드가 쌓아 온 헤리티지가 가장 가혹한 경쟁자가 될 때, 그 브랜드는 무엇으로 자신을 이길 수 있을까\?/);
  assert.match(html, /스포츠 브랜드가 디자인으로만 팔리기 시작할 때, 그 브랜드는 여전히 스포츠 브랜드일까\?/);
  assert.doesNotMatch(html, /브랜드의 헤리티지가 가장 가혹한 경쟁자가 되는 순간이다|나에게는 나이키 운동화가 딱 한 켤레|무엇이 세 번째 켤레로 이끌 것인가/);
  assert.match(html, /<figcaption style="text-align:center">참조 이미지- Nike Shox MR4 × Martine Rose<\/figcaption>/);
  assert.match(html, /if\(key==='nike-heritage'\|\|key==='alpha-offline'/);
  assert.doesNotMatch(html, /남편의 테크팩 사례를 더 구체화해줘|brPLACEHOLDER/);
  for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  await access(new URL('../public/notes-assets/nike-heritage.png', import.meta.url));
});
test('Nike route is consistently allowed by analytics and existing local exclusion remains', async () => {
  assert.match(await read('lib/traffic.ts'), /'nike-heritage'/);
  const client = await read('public/site-analytics.js');
  assert.match(client, /'nike-heritage'/);
  assert.match(client, /location.hostname === '127.0.0.1'/);
  assert.match(await read('app/notes/published.ts'), /addNikeHeritage\(addAlphaOffline\(notesDocument\)\)/);
});
