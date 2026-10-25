import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source = readFileSync(new URL('../app/notes/document.ts', import.meta.url), 'utf8');
const document = JSON.parse(source.match(/^const notesDocument = (.*);/)[1]);

test('trend note explains the question behind similar clothes in plain language', () => {
  assert.ok(document.includes('유행한 옷을 모아 보면 비슷한 색과 실루엣이 보인다. 하지만 내가 궁금한 건 그 옷들이 닮았다는 사실보다, 왜 그 시기에 그런 옷을 만들고 입고 싶어졌는가다.'));
  assert.ok(!document.includes('트렌드를 뒤에서 정리하면 비슷한 옷들의 목록이 남는다.'));
});
