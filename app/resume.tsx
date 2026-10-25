"use client";
import { useState } from "react";
import { chapters } from "./portfolio-data";
import { experience } from "./builder/content";

export function Resume() {
  const [page,setPage]=useState(0);
  const projects=["madeca-md","chaeum","yuriyuri"].map(id=>chapters.flatMap(c=>c.projects).find(p=>p.id===id)!);
  return <section className="landscape-resume" aria-label="레쥬메">
    <div className="resume-navigation"><span>RÉSUMÉ / SEOUL — LONDON</span><div role="tablist" aria-label="레쥬메 페이지">
      {["01 / OVERVIEW","02 / EXPERIENCE"].map((title,i)=><button key={title} id={`resume-tab-${i}`} role="tab" aria-selected={page===i} aria-controls={`resume-page-${i}`} tabIndex={page===i?0:-1} onClick={()=>setPage(i)} onKeyDown={e=>{if(["ArrowRight","ArrowLeft","Home","End"].includes(e.key)){e.preventDefault();const n=e.key==="Home"?0:e.key==="End"?1:1-page;setPage(n);document.getElementById(`resume-tab-${n}`)?.focus()}}}>{title}</button>)}
    </div></div>
    <div id="resume-page-0" role="tabpanel" aria-labelledby="resume-tab-0" hidden={page!==0} tabIndex={0} className="resume-landscape-page">
      <div className="resume-intro-grid"><div><p className="resume-kicker">PRODUCT &amp; BRAND BUSINESS LEADER</p><h2 className="resume-name">Yuri Choi<span>.</span></h2><p className="resume-locations">SEOUL &amp; LONDON</p></div><div className="resume-intro-copy"><h3>From product.<br/>To brand.<br/><em>To business.</em></h3><p>마데카 MD·웰라쥬의 제품 기획·개발부터 메디컬 뷰티 포트폴리오 운영까지.<br/>OEM 협업, 가격·손익 관리와 런던 기반 브랜드의 글로벌 유통 경험.</p></div></div>
      <div className="resume-results" aria-label="주요 성과">
        <article><div className="result-top"><span>01 / PRODUCT DEVELOPMENT</span><a href="#madeca-md" aria-label="마데카 MD 개발 사례 보기">VIEW ↗</a></div><strong>6<small>SKU</small></strong><h3>MADECA MD</h3><p>기획·가격·OEM·출시·운영<br/>제품 전 과정 담당</p></article>
        <article><div className="result-top"><span>02 / HERO PRODUCT</span><a href="#chaeum" aria-label="더채움 성과 상세 보기">VIEW ↗</a></div><strong>48.1<small>%</small></strong><h3>THE CHAEUM SALES CAGR</h3><p>2014–2017 더채움 HA 필러 매출 성장</p></article>
        <article><div className="result-top"><span>03 / PORTFOLIO GROWTH</span><a href="#dkma" aria-label="DKMA 성과 상세 보기">VIEW ↗</a></div><strong>64.7<small>%</small></strong><h3>2023-2025 SALES CAGR</h3><p>PORTFOLIO SALES GROWTH</p><p><b>108%</b> — 2025 SALES TARGET ACHIEVEMENT</p></article>
      </div>
      <div className="resume-career-grid">{experience.map(([period,name,role,description])=><article key={name}><span>{period}</span><h3>{name}</h3><b>{role}</b><p>{description}</p></article>)}</div>
    </div>
    <div id="resume-page-1" role="tabpanel" aria-labelledby="resume-tab-1" hidden={page!==1} tabIndex={0} className="resume-landscape-page">
      <header className="resume-experience-head"><h2>Science. Beauty.<br/><em>Business.</em></h2><p>상품기획부터 브랜드와 사업 운영까지.<br/>서로 다른 시장에서 쌓은 세 가지 경험.</p></header>
      <div className="resume-project-grid">{projects.map((p,i)=><article key={p.id}><a href={`#${p.id}`}><img src={p.images[0]} alt={p.title} loading="lazy"/><div><span>0{i+1} / {p.organization}</span><h3>{["BUILD","SCALE","CREATE"][i]} <small>↗</small></h3></div></a><h4>{p.title}</h4><p>{p.result||p.subtitle}</p><ul>{p.responsibilities.slice(0,3).map(t=><li key={t}>{t}</li>)}</ul></article>)}</div>
      <div className="resume-expertise-grid">{[["PRODUCT","상품전략 · 신제품 개발 · 제품 수명주기","시장·의료진 VOC · 컨셉 · SKU · 가격"],["BUSINESS","손익 · 원가 · 예산 · 채널 전략","3–5개년 매출 시나리오 · 손익분기점"],["LEADERSHIP","팀 운영 · OEM/ODM · 유관부서 협업","글로벌 바이어 · 크리에이티브 파트너"]].map(([t,...lines])=><article key={t}><h3>{t}</h3>{lines.map(l=><p key={l}>{l}</p>)}</article>)}</div>
      <footer className="resume-credentials"><div><h3>GLOBAL EXPERIENCE</h3><p>Savile Row Academy Master Tailoring · 한국인 최초 수료<br/>2020–2023 Member of the British Fashion Council<br/>런던 기반 브랜드 운영 · 10개국 이상 판매망</p></div><div><h3>CONTACT</h3><a href="mailto:onlyuri02@gmail.com">onlyuri02@gmail.com ↗</a><p>SEOUL — LONDON</p></div></footer>
    </div>
    <footer className="resume-pagination"><span>YURI CHOI / {page+1} OF 2</span><button onClick={()=>setPage(1-page)}>{page===0?"EXPERIENCE →":"← OVERVIEW"}</button></footer>
  </section>;
}
