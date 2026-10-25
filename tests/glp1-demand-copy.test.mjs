import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app/notes/document.ts',import.meta.url),'utf8');
const document=JSON.parse(source.match(/^const notesDocument = (.*);/)[1]);
test('GLP-1 note explains demand and inventory without the removed licensing detour',()=>{
  assert.ok(document.includes('<h2>여기서 읽어볼 수 있는 Social Stream</h2>'));
  assert.ok(!document.includes('이것이 내가 말하는 Social Stream이다'));
  assert.ok(document.includes('몸이 바뀌면 새 옷을 찾는 사람이 늘어난다. 하지만 새 수요가 생긴다고 모든 패션회사가 이익을 얻는 것은 아니다.'));
  assert.ok(document.includes('그 변화를 얼마나 빨리 읽고 생산에 반영하는가가 중요해진다.'));
  assert.ok(!document.includes('이런 거래에서 눈여겨볼 것은'));
  assert.ok(!document.includes('여기서 브랜드를 소유하는 회사와 실제 옷을 만들어 파는 회사의 역할을 다시 보게 된다.'));
  assert.ok(document.includes('제약회사가 사람의 몸을 바꾸면, 다음에는 누가 돈을 벌고 누가 비용을 떠안게 될까?'));
});
