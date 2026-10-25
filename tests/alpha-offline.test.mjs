import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';
import ts from 'typescript';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const original = JSON.parse(read('app/notes/document.ts').match(/^const notesDocument = (.*);/)[1]);
const compiled = ts.transpileModule(read('app/notes/alpha-offline.ts'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { default: addAlphaOffline } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const html = addAlphaOffline(original);

test('new note includes its image, card, article, questions and related note', () => {
  assert.equal((html.match(/<article class="card"/g) || []).length, (original.match(/<article class="card"/g) || []).length + 1);
  assert.ok(html.includes('알파세대는 화면 밖을 새롭다고 느낀다'));
  assert.ok(html.includes('data-note="alpha-offline"'));
  assert.ok(html.includes('data-alphaoffline-only hidden'));
  assert.ok(html.includes('브랜드의 진정성은 무엇으로 증명될까?'));
  assert.ok(html.includes('href="#note/alpha">알파세대의 취향은 누가 만드는가?'));
  assert.ok(html.includes('86%가 AI를 사용한 경험'));
  assert.ok(!compiled.includes('확인이 필요한 부분'));
  assert.ok(existsSync(new URL('../public/notes-assets/alpha-offline.png', import.meta.url)));
});

test('note insertion preserves valid browser scripts and production integration', () => {
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (match[0].includes('application/ld+json')) continue;
    new Script(match[1]);
  }
  assert.ok(read('app/notes/route.ts').includes('addAlphaOffline(notesDocument)'));
  assert.ok(read('lib/traffic.ts').includes("'alpha-offline'"));
  assert.ok(read('public/site-analytics.js').includes("'alpha-offline'"));
});
