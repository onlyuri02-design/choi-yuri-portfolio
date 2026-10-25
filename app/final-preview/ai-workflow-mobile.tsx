'use client';

import {useLayoutEffect, useRef} from 'react';
import {aiOperatingModel} from './ai-operating-model';
import {aiOverview, aiOverviewImage, AIPracticeDetail} from './ai-workflow-overview';

export function AIMobileOverview({active, onSelect}: {active: number|null; onSelect: (index: number) => void}) {
 const pendingScroll = useRef(false);

 useLayoutEffect(() => {
  if (!pendingScroll.current) return;
  pendingScroll.current = false;
  const trigger = document.getElementById('ai-mobile-trigger-' + active);
  if (!trigger || !trigger.getClientRects().length) return;
  const bounds = trigger.getBoundingClientRect();
  if (bounds.top < 8 || bounds.bottom > window.innerHeight - 8) {
   trigger.scrollIntoView({block: 'start', behavior: 'instant'});
  }
 }, [active]);

 return <div className="al-mobile-overview" aria-label="AI 실무 활용">
  {aiOverview.map((item, i) => {
   const model = aiOperatingModel[i];
   const open = active === i;
   return <section className="al-mobile-category" key={model.category}>
    <h2 className="al-mobile-heading">
     <button type="button" id={'ai-mobile-trigger-' + i}
      aria-expanded={open} aria-controls={'ai-mobile-panel-' + i}
      onClick={() => {
       pendingScroll.current = true;
       onSelect(i);
      }}>
      <span className="al-mobile-label">0{i + 1} / {model.category}</span>
      <span className="al-mobile-title">{model.label}</span>
      <span className="al-mobile-summary">{['시장·경쟁 동향 조사와 리포트','매출·손익 분석과 수익성 진단','프로젝트 계획과 업무 자동화','회의 기록을 결정과 실행으로'][i]}</span>
      <span className="al-mobile-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
     </button>
    </h2>
    <div className="al-mobile-panel" id={'ai-mobile-panel-' + i}
     role="region" aria-labelledby={'ai-mobile-trigger-' + i} hidden={!open}>
     <AIPracticeDetail index={i}/>
     <div className="al-capabilities">
      <header>
       <h3>{item.subtitle}</h3>
       <figure className="al-overview-image">
        <img src={aiOverviewImage(i)} alt={item.imageTitle + ' — 실제 업무 화면, 내부 정보 블러 처리'} loading="lazy"/>
       </figure>
      </header>
      <ul>{item.items.map((text, n) => <li key={text}>
       <span aria-hidden="true">0{n + 1}</span><p>{text}</p>
      </li>)}</ul>
     </div>
     <div className="al-mobile-resources">
      <h3 className="al-agents-label">KEY AGENTS <span>/ 역할</span></h3>
      <div className="al-agent-list">{model.agents.split(' / ').map(agent => <span key={agent}>{agent}</span>)}</div>
      <h3 className="al-tools-label">TOOLS</h3>
      <div className="al-tool-list">{item.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
      <div className="al-overview-output"><b>OUTPUT</b><span>{item.output}</span></div>
     </div>
    </div>
   </section>;
  })}
 </div>;
}
