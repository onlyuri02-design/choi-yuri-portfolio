'use client';
import {useState} from 'react';
import {AIApproach,AIOverview} from './ai-workflow-overview';
import {AIMobileOverview} from './ai-workflow-mobile';
export default function AIWorkflow(){
 const [active,setActive]=useState<number|null>(null);
 const toggle=(index:number)=>setActive(current=>current===index?null:index);
 return <section className="f-content ai-workflow">
 <header className="al-editorial-header"><h1>AI AGENT LEADERSHIP</h1></header>
 <div className="al-editorial-hero"><figure className="al-editorial-image"><img src="/portfolio/september-update/ibm-intelligence.webp" alt="장미와 눈, 분자 구조를 연결한 IBM 빈티지 광고" fetchPriority="high"/><figcaption>IBM / VINTAGE ADVERTISEMENT</figcaption></figure><div className="al-editorial-message"><h2><span>WHAT MAKES</span><span>INTELLIGENCE</span><mark>INTELLIGENT?</mark></h2><p>PATTERN / DATA / CONTEXT / DECISION</p><p className="al-workflow-statement">AI embedded across research, analysis, execution and decision-making.</p><AIApproach/></div></div>
 <AIOverview active={active} onSelect={toggle}/>
 <AIMobileOverview active={active} onSelect={toggle}/>
 <section className="al-shared-layer" aria-labelledby="ai-shared-title">
 <header><span className="al-shared-kicker">SHARED FOUNDATION</span><h2 id="ai-shared-title">AI Working<br/><mark>Standards</mark></h2><ul className="al-shared-criteria"><li>업무 목표</li><li>참고 자료</li><li>결과물 형식</li><li>검토 체크리스트</li></ul></header>
  <div className="al-shared-copy"><p>개인 <strong>Prompt Transformer</strong>로 업무 목표·참고 자료·결과물 형식을 정리.</p><p><strong>브랜드 자료와 SOP 템플릿</strong>으로 Agent별 지시와 결과물 양식을 통일.</p><div className="al-cycle"><h3>AI IN MY WORKFLOW</h3><p>RESEARCH → ANALYZE → PLAN → EXECUTE → DECIDE</p></div></div>
 </section>
 <section className="ai-tools-library" aria-labelledby="ai-tools-library-title">
 <h2 id="ai-tools-library-title">AI Tools<br/><mark>Library.</mark></h2>
 <div className="ai-tools-library-copy"><h3>어떤 AI를 어디에 써야 할까?</h3><p>업무 목적에 맞는 도구를 빠르게 찾도록<br/>직접 기획하고 제작한 탐색 툴.</p><p className="ai-tools-library-meta">9개 카테고리 · 29개 도구<br/>이름·용도 검색 / 용도 태그 / 공식 사이트 연결</p></div>
 <a className="ai-tools-library-link" href="/aitoollibrary" target="_blank" rel="noopener noreferrer" aria-label="AI 도구 찾기 페이지 이동 (새 탭)">AI 도구 찾기 페이지 이동 <span aria-hidden="true">↗</span></a>
 </section>
 <a className="al-back" href="/process/ai-leadership">← Work Process</a>
 </section>
}
