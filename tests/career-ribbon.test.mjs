import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('career ribbon links to the dedicated summary route without preview controls',()=>{
 const cover=read('app/final-preview/portfolio.tsx');
 assert.match(cover,/className="glance-ribbon" href="#cv\/summary"/);
 assert.equal((cover.match(/<span>Career at a Glance ↗<\/span>/g)||[]).length,2);
 assert.match(cover,/aria-label="Career at a Glance — 경력·성과 한눈에 보기"/);
 assert.doesNotMatch(cover,/LAYOUT PREVIEW|127\.0\.0\.1/);
 assert.match(read('app/final-preview/page.tsx'),/import '\.\/career-ribbon\.css'/);
});
test('ribbon uses approved type, color and timing with reduced-motion support',()=>{
 const css=read('app/final-preview/career-ribbon.css');
 for(const rule of ['top:0;left:0;width:100%','background:var(--f-yellow)','var(--f-serif)','22s linear infinite','prefers-reduced-motion:reduce','animation-play-state:paused'])assert.ok(css.includes(rule),rule);
});
test('summary link lands at career heading while ordinary CV retains routing behavior',()=>{
 const routing=read('app/final-preview/use-route-memory.ts');
 assert.match(routing,/route==='cv\/summary'/);
 assert.match(routing,/getElementById\('career-heading'\)/);
 assert.match(routing,/getBoundingClientRect\(\)\.top-24/);
});
