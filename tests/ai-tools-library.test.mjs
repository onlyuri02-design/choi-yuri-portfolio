import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app/final-preview/ai-workflow.tsx',import.meta.url),'utf8');
test('AI Tools Library follows standards and links to the public directory in a safe new tab',()=>{
 assert.ok(source.indexOf('ai-tools-library-title')>source.indexOf('ai-shared-title'));
 assert.ok(source.indexOf('ai-tools-library-title')<source.indexOf('className="al-back"'));
 assert.match(source,/AI Tools<br\/><mark>Library\.<\/mark>/);
 assert.match(source,/href="\/aitoollibrary" target="_blank" rel="noopener noreferrer"/);
 assert.match(source,/AI 도구 찾기 페이지 이동/);
 assert.match(source,/9개 카테고리 · 29개 도구/);
});

test('library is a first-class page with canonical metadata and scoped assets',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 const page=read('app/aitoollibrary/page.tsx'),library=read('app/aitoollibrary/library.tsx');
 assert.match(page,/canonical:'https:\/\/yurichoi\.com\/aitoollibrary'/);
 assert.match(library,/<main className="atl-page">/);
 assert.equal((library.match(/\{ name: "/g)||[]).length,29);
 assert.match(library,/\/aitoollibrary-assets\/hero-floppy-disks.jpg/);
 assert.match(read('app/sitemap.xml/route.ts'),/'\/aitoollibrary'/);
 assert.doesNotMatch(library,/<iframe|ai-tools-guide\.yurinananana/);
});

test('new route responds with actual directory HTML and internal portfolio link',{skip:!process.env.LIBRARY_BASE_URL},async()=>{
 const base=process.env.LIBRARY_BASE_URL;
 const response=await fetch(base+'/aitoollibrary');
 assert.equal(response.status,200);
 assert.equal(new URL(response.url).pathname,'/aitoollibrary');
 const html=await response.text();
 for(const label of ['AI Tool','Library.','Codex','NotebookLM','Veo 3.1'])assert.ok(html.includes(label));
 assert.ok(html.includes('https://yurichoi.com/aitoollibrary'));
 const portfolio=await(await fetch(base+'/process/ai-workflow')).text();
 assert.match(portfolio,/href="\/aitoollibrary"/);
 assert.doesNotMatch(portfolio,/ai-tools-guide\.yurinananana/);
});
