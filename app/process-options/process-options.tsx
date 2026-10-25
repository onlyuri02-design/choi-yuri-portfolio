'use client';
import {useEffect,useState} from 'react';
import {processGroups as groups,topicList,ProcessTopicContent as Content} from '../final-preview/process-topic-content';

type Variant='a'|'b'|'c';
const variants={a:['A','3열 목차형','전체 구조의 한눈 파악 · 하위 메뉴 선택 열람'],b:['B','좌측 목차형','연속적 읽기 경험 · 목차와 콘텐츠의 분리'],c:['C','단계형','한 단계에 집중 · 단계별 하위 메뉴 선택']};
export default function ProcessOptions(){
 const [variant,setVariant]=useState<Variant>('a');
 const [active,setActive]=useState<string|null>(null);
 const [chapter,setChapter]=useState(0);
 useEffect(()=>{const read=()=>{const value=location.hash.slice(1);if(value==='a'||value==='b'||value==='c'){setVariant(value);setActive(null);setChapter(0)}};read();addEventListener('hashchange',read);return()=>removeEventListener('hashchange',read)},[]);
 const selected=topicList.find(t=>t.id===active);
 useEffect(()=>{if(!active||!matchMedia('(max-width: 640px)').matches)return;const frame=requestAnimationFrame(()=>document.getElementById('topic-panel')?.scrollIntoView({block:'start',behavior:'smooth'}));return()=>cancelAnimationFrame(frame)},[active]);
 function choose(id:string,gi:number){setActive(current=>current===id?null:id);setChapter(gi)}
 function menu(gi:number){return <div className="o-submenu">{groups[gi].items.map(([id,title],ii)=><button key={id} onClick={()=>choose(id,gi)} aria-pressed={active===id} aria-controls="topic-panel"><small>{gi+1}.{ii+1}</small><span>{title}</span><span aria-hidden="true">{active===id?'−':'+'}</span></button>)}</div>}
 function panel(){return active&&selected?<section id="topic-panel" className="o-panel" aria-labelledby="topic-title"><header><span className="o-eyebrow">0{selected.gi+1} / {groups[selected.gi].title}</span><div><h2 id="topic-title">{selected.title}</h2><button onClick={()=>setActive(null)} className="o-close" aria-label="선택한 내용 닫기">Close ×</button></div></header><Content id={active}/><nav className="o-next" aria-label="내용 순서">{topicList.indexOf(selected)>0&&<button onClick={()=>{const t=topicList[topicList.indexOf(selected)-1];choose(t.id,t.gi)}}>← Previous</button>}{topicList.indexOf(selected)<topicList.length-1&&<button onClick={()=>{const t=topicList[topicList.indexOf(selected)+1];choose(t.id,t.gi)}}>Next — {topicList[topicList.indexOf(selected)+1].title} →</button>}</nav></section>:<div className="o-empty"><span>SELECT A TOPIC</span><p>하위 메뉴 선택 후 상세 내용 표시</p></div>}
 return <div className={'final-site o-site o-'+variant}>
 <div className="o-review"><span>WORK PROCESS / UX REVIEW</span><nav aria-label="시안 선택">{(['a','b','c'] as Variant[]).map(v=><a key={v} href={'#'+v} aria-current={variant===v?'page':undefined}>{variants[v][0]} · {variants[v][1]}{v==='a'?' / 추천':''}</a>)}</nav><a href="/final-preview#home">커버로 ↗</a></div>
 <header className="o-header"><a href="/final-preview#home" className="o-brand">YURI CHOI</a><nav aria-label="주요 메뉴"><a href="/final-preview#work">Work</a><a href="#a" aria-current="page">Work Process</a><a href="/final-preview#press">Media & Press</a><a href="/final-preview#cv">REQUEST CV</a></nav></header>
 <main><section className="o-hero"><img src="/process-review/mind-the-gap.jpg" alt="MIND THE GAP — 런던 지하철 승강장"/><div><span className="o-eyebrow">WORK PROCESS</span><h1>ANALYZE. DECIDE.<br/><mark>BUILD.</mark></h1><p>분석 · 판단 · 실행의 연결</p></div></section>
 <div className="o-structure">
 {variant==='a'&&<><nav className="o-index" aria-label="단계별 목차">{groups.map((g,i)=><section key={g.title}><header><span>0{i+1}</span><div><h2>{g.title}</h2><p>{g.caption}</p></div>{i<2&&<b aria-hidden="true">→</b>}</header>{menu(i)}</section>)}</nav>{panel()}</>}
 {variant==='b'&&<><aside className="o-rail" aria-label="단계별 목차">{groups.map((g,i)=><section key={g.title}><header><span>0{i+1}</span><h2>{g.title}</h2></header>{menu(i)}</section>)}</aside><div className="o-reading">{panel()}</div></>}
 {variant==='c'&&<><nav className="o-stepper" aria-label="단계 선택">{groups.map((g,i)=><button key={g.title} aria-pressed={chapter===i} onClick={()=>{setChapter(i);setActive(null)}}><span>0{i+1}</span><div><strong>{g.label}</strong><small>{g.title}</small></div>{i<2&&<i aria-hidden="true">→</i>}</button>)}</nav><section className="o-stage"><p>{groups[chapter].caption}</p>{menu(chapter)}</section>{panel()}<nav className="o-stage-next" aria-label="다음 단계">{chapter>0&&<button onClick={()=>{setChapter(chapter-1);setActive(null)}}>← 이전 단계</button>}{chapter<2&&<button onClick={()=>{setChapter(chapter+1);setActive(null)}}>0{chapter+2} {groups[chapter+1].label} →</button>}</nav></>}
 </div></main><footer className="o-footer"><span>YURI CHOI</span><small>© 2026 YURI CHOI — Designed & Built</small></footer>
 </div>
}
