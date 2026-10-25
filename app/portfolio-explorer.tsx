"use client";
import { useEffect, useRef, useState } from "react";
import { chapters as archiveChapters, portfolioChapters as chapters, featuredProjectIds, relatedProjectIds, portfolioAliases, type ChapterData, type Project } from "./portfolio-data";
import { Gallery } from "./portfolio";
import { PnlDiagram } from "./pnl-diagram";

export function projectGroups(chapter:ChapterData) {
  if(chapter.id==="medical")return [
    {id:"products",title:"PRODUCTS & GROWTH",label:"제품 · 포트폴리오 운영",projects:chapter.projects.filter(p=>p.period!=="EVENT ARCHIVE")},
    {id:"events",title:"EVENT ARCHIVE",label:"론칭 · 의료진 커뮤니케이션",projects:chapter.projects.filter(p=>p.period==="EVENT ARCHIVE")}
  ];
  if(chapter.id!=="fashion")return [{id:"projects",title:"PROJECT INDEX",label:"프로젝트 선택",projects:chapter.projects}];
  const definitions=[
    ["story","BRAND STORY","창립 스토리 · 테일러링",["yuriyuri","master-tailoring"]],
    ["retail","RETAIL & SHOWROOM","온라인 · 오프라인 · 쇼룸",["global-retail","offline-retail","showroom-london","showroom-paris"]],
    ["clients","CLIENTS","VIP · Celebrity & Editorial",["vip-clients","celebrity-editorial"]],
    ["collections","COLLECTION","AW · SS · Resort · Loungewear",["aw19","ss19","aw20","aw21","aw23","ss23","resort","lounge"]]
  ] as const;
  return definitions.map(([id,title,label,ids])=>({id,title,label,projects:ids.flatMap(id=>chapter.projects.filter(p=>p.id===id))}));
}
function ProjectDetail({project}:{project:Project}){return <article id={project.id} className={"focused-project"+(project.id==="profitability"?" pnl-project":"")} aria-label={project.title.replaceAll("\n"," ")}>
  <div className="project-info"><div className="eyebrow">{project.organization}<br/>{project.period}</div><h3>{project.title.split("\n").map(t=><span key={t}>{t}</span>)}</h3><h4>{project.subtitle}</h4><p className="project-description">{project.description}</p><div className="contribution"><h5>MY CONTRIBUTION</h5><ul>{project.responsibilities.map(t=><li key={t}>{t}</li>)}</ul></div>{project.result&&<p className="project-result">{project.result}</p>}{project.note&&<p className="project-note">{project.note}</p>}</div>
  {project.id==="profitability"?<PnlDiagram/>:<Gallery key={project.id} project={project}/>}
</article>}
function RelatedExperience({project}:{project:Project}){
  const related=(relatedProjectIds[project.id]||[]).map(id=>archiveChapters.flatMap(c=>c.projects).find(p=>p.id===id)!);
  useEffect(()=>{const reveal=()=>{const hash=location.hash.slice(1);const target=document.getElementById(`related-${project.id}-${hash}`);if(target instanceof HTMLDetailsElement){target.open=true;target.scrollIntoView({behavior:"instant",block:"start"})}};reveal();addEventListener("hashchange",reveal);return()=>removeEventListener("hashchange",reveal)},[project.id]);
  if(!related.length)return null;
  return <section className="related-experience" aria-label="관련 업무 경험"><p className="related-label">BUSINESS CONTEXT <span>관련 업무 경험과 운영 방식</span></p>{related.map(p=><details key={p.id} id={`related-${project.id}-${p.id}`}><summary>{p.title.replaceAll("\n"," ")}<span aria-hidden="true">+</span></summary><p className="related-scope">{p.id==="business-strategy"?"동국제약 포트폴리오 전략":p.id==="profitability"?"공통 손익 관리 경험 · 아래 다이어그램은 일반적인 분석 절차입니다.":"서울·런던의 조직 및 글로벌 파트너 협업 경험"}</p><ProjectDetail project={p}/></details>)}</section>
}
function CategoryContent({chapter,selected,onSelect}:{chapter:ChapterData;selected:string;onSelect:(id:string)=>void}){
  const groups=projectGroups(chapter),group=groups.find(g=>g.projects.some(p=>p.id===selected))||groups[0];
  const project=chapter.projects.find(p=>p.id===selected)||group.projects[0];
  const ordered=groups.flatMap(g=>g.projects),index=ordered.findIndex(p=>p.id===project.id);
  const focus=useRef<HTMLDivElement>(null);
  const select=(id:string)=>{onSelect(id);requestAnimationFrame(()=>{focus.current?.focus({preventScroll:true});focus.current?.scrollIntoView({behavior:"instant",block:"start"})})};
  return <div className="category-content">
    <aside className="focused-index" aria-label="프로젝트 인덱스"><div className="index-heading"><span>PROJECT INDEX</span><small>{ordered.length} PROJECTS</small></div>
      {groups.map(g=><details key={g.id} open={g.id===group.id} className="project-group"><summary>{g.title}<span>+</span><small>{g.label}</small></summary><div>{g.projects.map(p=><button key={p.id} onClick={()=>select(p.id)} aria-current={project.id===p.id?"page":undefined}>{p.title.replaceAll("\n"," ")}<span>↗</span></button>)}</div></details>)}
    </aside>
    <div className="focused-content" ref={focus} tabIndex={-1}><nav className="project-breadcrumb" aria-label="현재 프로젝트"><span>{group.title} / {project.title.replaceAll("\n"," ")}</span><span>{String(index+1).padStart(2,"0")} / {String(ordered.length).padStart(2,"0")}</span></nav><ProjectDetail project={project}/><RelatedExperience key={project.id} project={project}/><nav className="focused-pagination" aria-label="프로젝트 이동"><button disabled={index===0} onClick={()=>select(ordered[index-1].id)}>← PREVIOUS</button><a href={`#${chapter.id}`}>CATEGORY INDEX ↑</a><button disabled={index===ordered.length-1} onClick={()=>select(ordered[index+1].id)}>NEXT →</button></nav></div>
  </div>
}
export function PortfolioExplorer(){
  const [open,setOpen]=useState<string|null>(null),[selected,setSelected]=useState("");
  useEffect(()=>{const sync=()=>{const rawHash=decodeURIComponent(location.hash.slice(1));const hash=portfolioAliases[rawHash]||rawHash;const chapter=chapters.find(c=>c.id===hash||c.projects.some(p=>p.id===hash));if(chapter){setOpen(chapter.id);setSelected(chapter.projects.some(p=>p.id===hash)?hash:projectGroups(chapter)[0].projects[0].id);requestAnimationFrame(()=>{const target=document.getElementById(`related-${hash}-${rawHash}`)||document.getElementById(hash);if(target instanceof HTMLDetailsElement)target.open=true;target?.scrollIntoView({behavior:"instant",block:"start"})})}else if(["portfolio","index"].includes(hash)){setOpen(null)}};sync();addEventListener("hashchange",sync);return()=>removeEventListener("hashchange",sync)},[]);
  const toggle=(chapter:ChapterData)=>{const next=open===chapter.id?null:chapter.id;setOpen(next);if(next)setSelected(projectGroups(chapter)[0].projects[0].id);history.pushState(null,"",next?`#${next}`:"#portfolio");requestAnimationFrame(()=>document.getElementById(chapter.id)?.scrollIntoView({behavior:"instant",block:"start"}))};
  const select=(id:string)=>{setSelected(id);if(location.hash!==`#${id}`)history.pushState(null,"",`#${id}`)};
  const featured=featuredProjectIds.map(id=>chapters.flatMap(c=>c.projects).find(p=>p.id===id)!);
  return <section className="portfolio-explorer" aria-label="포트폴리오 카테고리"><header className="explorer-heading"><div><span>SELECTED PORTFOLIO</span><p>제품 개발 · 메디컬 뷰티 성장 · 글로벌 브랜드 운영</p></div><button onClick={()=>{setOpen(null);history.replaceState(null,"","#portfolio")}} disabled={!open}>전체 접기 −</button></header>
    <nav className="featured-cases" aria-label="대표 사례 3개">{featured.map((p,i)=><a key={p.id} href={`#${p.id}`}><img src={p.images[0]} alt={p.title} loading="lazy"/><span className="featured-kicker">0{i+1} / {["BEAUTY","MEDICAL BEAUTY","YURI&YURI LONDON"][i]}</span><h3>{p.title}<span aria-hidden="true">↗</span></h3><p>{["기획부터 출시·운영까지, Madeca MD 5종 제품 개발","의료진 VOC 기반 제품 운영과 매출 성장","상품기획·생산·글로벌 유통을 잇는 브랜드 운영"][i]}</p></a>)}</nav>
    <p className="archive-label">EXPLORE ALL WORK <span>분야별 전체 프로젝트</span></p>
    {chapters.map(c=><section className="category-accordion" key={c.id} id={c.id}>
      <h2><button className="category-toggle" id={`category-toggle-${c.id}`} aria-expanded={open===c.id} aria-controls={`category-panel-${c.id}`} onClick={()=>toggle(c)}><span className="category-order">{c.number}</span><span className="category-title">{c.title.split("\n").map(t=><span key={t}>{t}</span>)}</span><span className="category-action"><span>{open===c.id?"CLOSE":"EXPLORE"}</span><b aria-hidden="true">{open===c.id?"−":"+"}</b><small>{c.projects.length} PROJECTS</small></span></button></h2>
      <div id={`category-panel-${c.id}`} hidden={open!==c.id} role="region" aria-labelledby={`category-toggle-${c.id}`}>{open===c.id&&<CategoryContent chapter={c} selected={selected} onSelect={select}/>}</div>
    </section>)}
  </section>
}
