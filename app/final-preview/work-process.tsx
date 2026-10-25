'use client';
import {Fragment,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {useMobileLayout} from './mobile-disclosure';
import {processGroups as groups,topicList,ProcessTopicContent} from './process-topic-content';
export {principles,steps,decisions,systems,caseRows} from './process-data';
const aliases:Record<string,string>={principles:'approach',decisions:'decision','decision-log':'decision'};
export default function WorkProcess({section}:{section?:string}){
 const mobile=useMobileLayout();
 const initial=aliases[section||'']||section||'approach';
 const [active,setActive]=useState<string|null>(topicList.some(t=>t.id===initial)?initial!:null);
 const [expandedGroup,setExpandedGroup]=useState<number|null>(null);
 const pendingGroupScroll=useRef(false);
 const panelRef=useRef<HTMLElement>(null);
 const firstPanel=useRef(true);
 const selected=topicList.find(t=>t.id===active);
 useEffect(()=>{const id=aliases[section||'']||section||(mobile?'':'approach');const topic=topicList.find(t=>t.id===id);setActive(topic?.id??null);setExpandedGroup(mobile&&topic?topic.gi:null)},[section,mobile]);
 useLayoutEffect(()=>{if(!pendingGroupScroll.current)return;pendingGroupScroll.current=false;if(expandedGroup===null)return;const trigger=document.getElementById('process-group-trigger-'+expandedGroup);if(trigger){const bounds=trigger.getBoundingClientRect();if(bounds.top<8||bounds.bottom>innerHeight-8)trigger.scrollIntoView({block:'start',behavior:'instant'})}},[expandedGroup]);
 function updateTopic(id:string|null){setActive(id);if(mobile&&id)setExpandedGroup(topicList.find(t=>t.id===id)?.gi??null);history.replaceState(history.state,'',id?'/process/'+id:'/process');window.dispatchEvent(new Event('yc:navigation'))}
 function toggleGroup(index:number){pendingGroupScroll.current=true;setExpandedGroup(current=>current===index?null:index);updateTopic(null)}
 function choose(id:string){updateTopic(active===id?null:id)}
 function move(offset:number){if(!selected)return;const next=topicList[topicList.indexOf(selected)+offset];if(next)updateTopic(next.id)}
 useEffect(()=>{if(firstPanel.current){firstPanel.current=false;if(!section)return;}if(active){const frame=requestAnimationFrame(()=>{const target=matchMedia('(max-width:700px)').matches?document.getElementById('topic-'+active):panelRef.current;target?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});return()=>cancelAnimationFrame(frame)}},[active]);
 function close(){const id=active;updateTopic(null);requestAnimationFrame(()=>document.getElementById('topic-'+id)?.focus())}
 const panel=<section ref={panelRef} id="topic-panel" className={'o-panel'+(mobile?' o-mobile-panel':'')+(!selected?' o-empty':'')} aria-labelledby={selected?(mobile?'topic-'+active:'topic-title'):undefined} aria-label={selected?undefined:'주제 선택 안내'}>
  {selected&&active?<><header><span className="o-eyebrow">0{selected.gi+1} / {groups[selected.gi].title}</span><div><h2 id="topic-title"><small>{selected.gi+1}.{selected.ii+1}</small>{selected.title}</h2><button onClick={close} className="o-close">Close ×</button></div></header>
   <ProcessTopicContent id={active} base=""/>
   <nav className="o-next" aria-label="순서대로 읽기">{topicList.indexOf(selected)>0&&<button onClick={()=>move(-1)}>← Previous</button>}{topicList.indexOf(selected)<topicList.length-1&&<button onClick={()=>move(1)}>Next — {topicList[topicList.indexOf(selected)+1].title} →</button>}</nav>
  </>:<><span>SELECT A TOPIC ↑</span><p>목차의 + 버튼 선택 · 한 번에 하나의 주제 열람</p></>}
 </section>;
 return <section className="f-content o-site o-integrated">
  <section className="o-hero" aria-label="분석·판단·실행"><div className="o-hero-crop"><img src="/process-review/process-hero-v5.png" alt="파란 배경에서 장난감 비행기를 살펴보는 소년"/></div><div className="o-hero-copy"><h1>Work Process</h1><h2>ANALYZE.<br/>DECIDE.<br/><mark>BUILD.</mark></h2></div></section>
  <div className="o-map-heading"><span>EXPLORE MY PROCESS</span></div>
  <nav className="o-index" aria-label="Work Process 단계별 목차">{groups.map((g,i)=>{
   const content=<><div className="revision-stage-summary"><p>{g.summary}</p><a href={g.caseHref}>{g.caseName} — 대표 사례 ↗</a></div>
    <div className="o-submenu">{g.items.map(([id,title],ii)=><Fragment key={id}><a href={'/process/'+id} className="o-topic-trigger" id={'topic-'+id} aria-expanded={active===id} aria-controls={!mobile||active===id?'topic-panel':undefined} aria-pressed={active===id} onClick={event=>{event.preventDefault();choose(id)}}><small>{i+1}.{ii+1}</small><span>{title}</span><span aria-hidden="true">{active===id?'−':'+'}</span></a>{mobile&&active===id&&panel}</Fragment>)}</div></>;
   return <section key={g.title} className={(mobile?expandedGroup===i:selected?.gi===i)?'is-active':''}>
    {mobile?<><header className="o-group-header"><h2><button type="button" className="o-group-trigger" id={'process-group-trigger-'+i} aria-expanded={expandedGroup===i} aria-controls={'process-group-panel-'+i} onClick={()=>toggleGroup(i)}><span className="o-group-number">0{i+1}</span><span className="o-group-copy"><span className="o-group-label">{g.label}</span><span className="o-group-title">{g.title}</span><span className="o-group-caption">{g.caption}</span></span><span className="o-group-toggle" aria-hidden="true">{expandedGroup===i?'−':'+'}</span></button></h2></header>
     <div className="o-group-panel" id={'process-group-panel-'+i} role="region" aria-labelledby={'process-group-trigger-'+i} hidden={expandedGroup!==i}>{content}</div></>
     :<><header><span>0{i+1}</span><div><small>{g.label}</small><h2>{g.title}</h2><p>{g.caption}</p></div>{i<2&&<b aria-hidden="true">→</b>}</header>{content}</>}
   </section>;
  })}</nav>
  {!mobile&&panel}
 </section>
}
