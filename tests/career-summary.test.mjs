import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const summary=read('app/final-preview/career-summary.tsx');

test('only the requested DKMA leadership responsibility uses the existing neon lime mark',()=>{
 assert.match(summary, /item === highlightedItem \? <mark>\{item\}<\/mark> : item/);
 assert.match(summary, /label="DKMA" href="\/case\/dkma" highlightedItem="조직 구축·연간 KPI·분기별 OKR·인사평가·성과관리"/);
 assert.equal((summary.match(/highlightedItem="/g)||[]).length,1);
 assert.match(read('app/final-preview/revision.css'), /\.final-site mark\{background:var\(--f-yellow\);color:#000/);
});

test('Hugel image fills the career row height without changing the mobile crop',()=>{
 const css=read('app/final-preview/career-summary.css');
 assert.match(css,/@media\(min-width:701px\)\{\s*\.career-summary \.career-image-hugel img\{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top\}/);
 assert.match(read('app/final-preview/mobile-disclosure.css'),/\.career-image-hugel img\{object-fit:contain\}/);
});

test('GLOBAL metric shows the English credential as a secondary line',()=>{
 assert.match(summary,/value:'GLOBAL',label:'런던 · 파리 · 뮌헨',detail:'쇼룸·해외 바이어 협업',credential:'English · OPIc AL'/);
 assert.equal((summary.match(/credential:'English · OPIc AL'/g)||[]).length,1);
 assert.match(read('app/final-preview/career-summary.css'),/\.career-metric-credential\{margin-top:12px;font-size:\.92em;color:#666\}/);
});

test('YURI&YURI launch metric includes requested London and company credentials',()=>{
 assert.match(summary,/label:'브랜드 공식 론칭',detail:\['London Savile Row Street','UK Company House','Member of British Fashion Council'\]/);
 assert.match(summary,/value:'2020–2023',label:'Member of the',detail:'British Fashion Council'/);
});
test('CV career summary uses three company rows with real images and existing case links',()=>{
 assert.match(read('app/final-preview/cv-page.tsx'),/<CareerSummary\/>/);
 assert.equal((summary.match(/<CareerRow labelledBy=/g)||[]).length,3);
 assert.match(summary,/function CareerRow/);
 assert.match(summary,/MobileDisclosure title="경력 상세/);
 for(const id of ['dkma','yuriyuri','chaeum'])assert.ok(summary.includes(`href="/case/${id}"`));
 for(const [,src] of summary.matchAll(/<img src="([^"]+)"/g))assert.ok(existsSync(new URL('../public'+src,import.meta.url)),src);
});
test('career redesign preserves the approved qualifications and separates cost figures',()=>{
 for(const value of ['64.7%','108%','26','6–10%p','4명','6명','2019','10+','48.1%','50%'])assert.ok(summary.includes(`value:'${value}'`));
 for(const text of ['별도 Bellast 패키지 4% 절감','매출 CAGR (약)','2018–2023','이후 유지 운영','British Fashion Council'])assert.ok(summary.includes(text));
 assert.ok(summary.includes('포상 후보 추천 2명'));
 assert.doesNotMatch(summary,/수상 실적 아님/);
 assert.doesNotMatch(summary,/(?:45|113|122)억|10[–-]15억/);
 assert.doesNotMatch(summary,/2명 이직 · 4명 재직|최종 투자·지출 승인권과는 구분/);
 for(const text of ['Madeca MD 5종 포함 총 26개의 SKU 포트폴리오 구성과 운영','모두 채용, 현재까지 재직 중','브랜드 커뮤니케이션 IMC & CX 기획 및 운영'])assert.ok(summary.includes(text));
});
