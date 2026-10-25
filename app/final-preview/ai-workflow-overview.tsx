import type {KeyboardEvent} from 'react';
import {aiOperatingModel} from './ai-operating-model';

export const aiOverview = [
 {subtitle:'시장과 트렌드를 읽는\nAI 리서치 에이전트',tools:['Perplexity','Grok','NotebookLM','Gemini','GPT'],output:'Daily Market Intelligence Report',items:['시장 동향 및 트렌드, 주요 이슈 조사 · 데일리 리포트 자동화','플랫폼별 경쟁 브랜드 활동 현황 모니터링 및 리포트 자동화','방대한 자료의 수집·요약·분석 및 인사이트 도출'],image:'context-slide46.png',imageTitle:'Brand Resource & SOP Template'},
 {subtitle:'데이터로 기회를 만드는\n비즈니스 분석 에이전트',tools:['GPT','Claude','Gemini','Genspark'],output:'P&L Dashboard / Portfolio Analysis',items:['매출·SKU·P&L 데이터 분석 및 포트폴리오 수익성 진단','시장·제품·채널별 시뮬레이션 및 사업성 검토','요청 기반 AI 지원 분석 및 마케팅·사업 대시보드 구성'],image:'portfolio-slide46.png',imageTitle:'Portfolio Dashboard'},
 {subtitle:'실행력을 높이는\n업무 자동화 에이전트',tools:['GPT','Claude','Genspark','EdrawMind'],output:'Project Planner / AI-assisted Workflow',items:['프로젝트 플래닝, PERT, 타임라인 설계','AI 지원 업무 프로세스 설계 및 맞춤형 프로그램 개발 (Vibe Coding)','콘텐츠·마케팅 반복 업무의 자동화용 워크플로 설계·구축'],image:'execution-slide46.png',imageTitle:'Project Planning & Follow-through'},
 {subtitle:'더 나은 의사결정을 위한\n에이전트',tools:['DAGLO','NotebookLM','GPT','Claude'],output:'Decision Summary / Action Tracker',items:['회의 기록 입력 후 AI 요약 및 핵심 내용 구조화','의사결정 사항, 오픈 이슈, Action Item AI 지원 정리 (Owner · Due Date 포함)','다양한 관점의 시나리오 분석 및 의사결정 지원'],image:'decisions-slide46.png',imageTitle:'Meeting Notes to Action'},
];
export const aiOverviewImage=(i:number)=>'/portfolio/ai-leadership/'+aiOverview[i].image;

export function AIApproach(){
 return <div className="al-approach">
  <h3>MY AI APPROACH</h3>
  <dl>
   <div><dt>AUGMENT</dt><dd>AI를 통한 더 넓은 시야, 더 깊은 분석, 더 빠른 실행</dd></div>
   <div><dt>AUTOMATE</dt><dd>반복 업무의 시스템화로 더 중요한 일에 집중</dd></div>
   <div><dt>ACCELERATE</dt><dd>데이터 기반의 빠르고 정확한 의사결정으로 더 큰 성과 창출</dd></div>
  </dl>
 </div>;
}

export function AIPracticeDetail({index}:{index:number}){
 const model=aiOperatingModel[index];
 return <div className="al-copy al-inline-detail">
  <section className="al-detail-flow"><h3>{model.mode}</h3><p>{model.flow}</p></section>
  <dl className="revision-ai-ownership"><div><dt>MY REVIEW / 직접 검증·판단</dt><dd>{model.review}</dd></div></dl>
 </div>;
}

export function AIOverview({active,onSelect}:{active:number|null;onSelect:(i:number)=>void}){
 const navigate=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{
  let next=i;
  if(e.key==='ArrowRight')next=(i+1)%4;else if(e.key==='ArrowLeft')next=(i+3)%4;else if(e.key==='Home')next=0;else if(e.key==='End')next=3;else return;
  e.preventDefault();document.getElementById('ai-tab-'+next)?.focus();
 };
 return <div className="al-overview" aria-label="AI 실무 활용">
  {aiOverview.map((item,i)=><div className="al-overview-card" key={item.image}>
   <button className="al-overview-tab" type="button" id={'ai-tab-'+i} aria-expanded={active===i} aria-controls={'ai-card-detail-'+i} onClick={()=>onSelect(i)} onKeyDown={e=>navigate(e,i)}>
    <small className="al-overview-category"><span>0{i+1} / {aiOperatingModel[i].category}</span><span className="al-tab-hint">{active===i?'닫기 −':'상세 보기 +'}</span></small>
    <span className="al-overview-title">{aiOperatingModel[i].label}</span>
    <span className="al-agents-label">KEY AGENTS <span>/ 역할</span></span>
    <span className="al-agent-list">{aiOperatingModel[i].agents.split(' / ').map(agent=><span key={agent}>{agent}</span>)}</span>
    <span className="al-tools-label">TOOLS</span>
    <span className="al-tool-list">{item.tools.map(tool=><span key={tool}>{tool}</span>)}</span>
    <span className="al-overview-output"><b>OUTPUT</b><span>{item.output}</span></span>
   </button>
   <div className="al-card-content">
   <div id={'ai-card-detail-'+i} role="region" aria-labelledby={'ai-tab-'+i} hidden={active!==i}><AIPracticeDetail index={i}/></div>
   <div className="al-capabilities"><header><h3>{item.subtitle}</h3><figure className="al-overview-image"><img src={aiOverviewImage(i)} alt={item.imageTitle+' — 실제 업무 화면, 내부 정보 블러 처리'} loading="lazy"/></figure></header><ul>{item.items.map((text,n)=><li key={text}><span aria-hidden="true">0{n+1}</span><p>{text}</p></li>)}</ul></div>
   </div>
  </div>)}
 </div>;
}
