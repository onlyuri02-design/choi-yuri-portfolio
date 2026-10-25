'use client';
import {useLayoutEffect,useRef,useState} from 'react';
import {useMobileLayout} from './mobile-disclosure';
const entries={
discover:{label:'01 / DISCOVER — 브랜드를 만나는 접점',medical:'DKMA 브랜드 캠페인과 신제품 Launch Communication을 연결. 개별 제품의 메시지를 포트폴리오 브랜드 관점으로 정리.',fashion:'브랜드 웹사이트·SNS·Meta Ads를 직접 운영하고, 글로벌 패션 미디어 PR과 인물 협업을 통해 브랜드를 소개.'},
verify:{label:'02 / VERIFY — 신뢰의 근거를 설계',medical:'신제품 Launch Symposium, KOL session과 HCP education을 연결. 제품 포지셔닝과 학술 콘텐츠를 의료진이 판단할 수 있는 근거로 구성.',fashion:'The Rake·GQ 등 패션 미디어와 인물 스타일링을 통한 브랜드 소개. 제품의 테일러링과 디자인을 제3자의 시선으로 전달.'},
experience:{label:'03 / EXPERIENCE — 제품을 이해하는 경험',medical:'심포지엄·HCP 교육과 병·의원 접점을 연결. Madeca MD의 제품 도입·Visual Direction·Channel Marketing으로 스킨케어 접점 확장.',fashion:'London·Paris·Munich 쇼룸과 피팅·제품 상담을 운영. 온라인에서 본 제품을 실물 경험과 고객·바이어 관계로 연결.'},
convert:{label:'04 / CONVERT — 산업에 맞는 구매 연결',medical:'제품 포지셔닝·HCP 교육·심포지엄·Sales Toolkit을 현장 영업과 연결. 의료진의 제품 도입과 병·의원 주문을 지원.',fashion:'Content → Website → Commerce를 직접 운영. 자사몰 주문과 문의·피팅 후 맞춤 제작, 바이어 미팅과 홀세일 주문을 병행.'},
retain:{label:'05 / RETAIN — 관계와 거래의 지속',medical:'HCP·Partner CRM 개발과 교육 접점을 연결. Account 분석을 바탕으로 Bundle·구매 약정·프로모션 정책과 자원 배분을 설계.',fashion:'고객 문의·주문·배송·맞춤 제작을 직접 관리. Private Client와 바이어의 제품 상담 및 후속 거래 접점을 지속 운영.'},
advocate:{label:'06 / ADVOCATE — 다음 발견을 만드는 신뢰',medical:'KOL·HCP와 학술 콘텐츠, 심포지엄·교육 네트워크를 연결해 새로운 의료진 접점을 형성.',fashion:'고객·인물 스타일링·Editorial의 제품 노출을 소셜·미디어 콘텐츠와 연결해 새로운 브랜드 발견 접점으로 활용.'}
};
type Stage = keyof typeof entries;
const stages: [Stage,string,string,string][] = [
 ['discover','DISCOVER','Content · Social','PR · Influencer'],
 ['verify','VERIFY','Expert · KOL','Editorial'],
 ['experience','EXPERIENCE','Clinic · Showroom','Product'],
 ['convert','CONVERT','HCP · Sales','DTC · Wholesale'],
 ['retain','RETAIN','CRM · Account','Client Relationship'],
 ['advocate','ADVOCATE','KOL · Media','Client Network'],
];
export default function IntegratedGrowth(){
 const mobile=useMobileLayout();
 const [expanded,setExpanded]=useState<Stage|null>(null);
 const pendingScroll=useRef(false);
 useLayoutEffect(()=>{if(!pendingScroll.current||!expanded)return;pendingScroll.current=false;const trigger=document.getElementById('yg-trigger-'+expanded);if(trigger&&trigger.getBoundingClientRect().top<0)trigger.scrollIntoView({block:'start',behavior:'instant'})},[expanded]);
 const [active,setActive]=useState<Stage>('verify');
 const selected=entries[active];
 return <article id="yuri-growth" aria-labelledby="yg-title">
<section className="yg-hero" aria-label="페이지 제목">
<p className="yg-kicker">02 / Decisions in Practice · 2.5 / Digital Marketing &amp; Growth</p>
<h2 className="yg-title" id="yg-title">INTEGRATED<br/><em>GROWTH MARKETING.</em></h2>
<div className="yg-hero-bottom"><p className="yg-subtitle">From brand experience<br/>to business growth.</p><p className="yg-lead">발견에서 신뢰, 경험, 구매와 관계까지.<br/>Medical Beauty와 Fashion에서 콘텐츠·디지털·오프라인·영업 접점을 연결해 온 마케팅 설계와 실행.</p></div>
<p className="yg-bridge">Brand Strategy · Digital &amp; O2O · Commercial Execution</p>
</section>
<section className="yg-system" aria-label="성장 여정과 단계별 사례">
<div className="yg-section-head"><h3>One connected journey.</h3><p>단계를 선택하면 두 산업의 실행 사례가 바뀝니다.</p></div>
{mobile?<div className="yg-mobile-stages">{stages.map(([id,label],index)=><section key={id}>
 <button className="yg-mobile-trigger" id={'yg-trigger-'+id} type="button" aria-expanded={expanded===id} aria-controls={'yg-panel-'+id} onClick={()=>{pendingScroll.current=true;setExpanded(expanded===id?null:id);setActive(id)}}><span>0{index+1} / {label}</span><span aria-hidden="true">{expanded===id?'−':'+'}</span></button>
 <div className="yg-mobile-evidence" id={'yg-panel-'+id} role="region" aria-labelledby={'yg-trigger-'+id} hidden={expanded!==id}>
  <p className="yg-kicker">{entries[id].label}</p>
  <article><h4>Medical Beauty / Dongkook</h4><p>{entries[id].medical}</p><p className="yg-route">Brand → KOL · Scientific Content → HCP · Clinic → Sales · CRM</p><p className="yg-mobile-scope">수행 범위: DKMA 브랜드 캠페인 · 신제품 Launch Communication · KOL/HCP 프로그램 · Madeca MD 제품 도입 및 Channel Marketing · Account 분석과 영업정책.</p><nav className="yg-case-links"><a href="/case/dkma">DKMA case ↗</a><a href="/project/madeca-md">Madeca MD ↗</a></nav></article>
  <article><h4>Fashion / YURI&amp;YURI</h4><p>{entries[id].fashion}</p><p className="yg-route">Content → Editorial · Showroom → DTC · Wholesale → Client</p><p className="yg-mobile-scope">수행 범위: 브랜드 웹사이트·SNS·Meta Ads 직접 운영 · 글로벌 패션 미디어 PR · London·Paris·Munich 쇼룸 · 피팅과 맞춤 제작 · DTC·홀세일 운영.</p><nav className="yg-case-links"><a href="/case/yuriyuri">YURI&amp;YURI case ↗</a></nav></article>
 </div>
</section>)}</div>:<><div className="yg-loop" role="group" aria-label="구매 여정 단계 선택">
{stages.map(([id,label,first,second],index)=><button type="button" key={id} data-stage={id} aria-pressed={active===id} aria-controls="yg-case-evidence" onClick={()=>setActive(id)}><span className="yg-step">0{index+1} <span aria-hidden="true">{index===5?'↻':'→'}</span></span><strong>{label}</strong><small>{first}<br/>{second}</small></button>)}
</div>
<div className="yg-return">↶ 관계와 신뢰를 다음 발견의 접점으로</div>
<div className="yg-cases" id="yg-case-evidence">
<div className="yg-cases-head"><h3>TWO INDUSTRIES. ONE APPROACH.</h3><span id="yg-selected-stage" aria-live="polite">{selected.label}</span></div>
<div className="yg-two">
<article className="yg-case"><p className="yg-kicker">Medical Beauty / Dongkook</p><h4>Authority to adoption.</h4><p className="yg-summary">브랜드 메시지와 학술 콘텐츠를 의료진 접점에 연결하고, 제품 도입과 영업 실행을 지원.</p><div className="yg-route">Brand → KOL · Scientific Content → HCP · Clinic → Sales · CRM</div><div className="yg-evidence"><span className="yg-evidence-label">SELECTED EXPERIENCE</span><p id="yg-medical-evidence">{selected.medical}</p></div><details><summary className="">프로젝트와 수행 범위</summary><p>DKMA 브랜드 캠페인 · 신제품 Launch Communication · KOL/HCP 프로그램 · Madeca MD 제품 도입 및 Channel Marketing · Account 분석과 영업정책.</p></details><nav className="yg-case-links" aria-label="Medical Beauty 관련 사례"><a href="/case/dkma">DKMA case ↗</a><a href="/project/madeca-md">Madeca MD ↗</a></nav></article>
<article className="yg-case"><p className="yg-kicker">Fashion / YURI&amp;YURI</p><h4>Identity to commerce.</h4><p className="yg-summary">직접 만든 제품과 콘텐츠를 미디어·쇼룸·자사몰로 연결하고, 고객과 바이어 관계까지 운영.</p><div className="yg-route">Content → Editorial · Showroom → DTC · Wholesale → Client</div><div className="yg-evidence"><span className="yg-evidence-label">SELECTED EXPERIENCE</span><p id="yg-fashion-evidence">{selected.fashion}</p></div><details><summary className="">프로젝트와 수행 범위</summary><p>브랜드 웹사이트·SNS·Meta Ads 직접 운영 · 글로벌 패션 미디어 PR · London·Paris·Munich 쇼룸 · 피팅과 맞춤 제작 · DTC·홀세일 운영.</p></details><nav className="yg-case-links" aria-label="Fashion 관련 사례"><a href="/case/yuriyuri">YURI&amp;YURI case ↗</a></nav></article>
</div>
</div>
</>}
</section>
<section className="yg-method" aria-label="설계와 실행 방식"><div className="yg-section-head"><h3>How I build growth.</h3><p>접점을 설계하고, 실행을 연결하고, 자원을 조정합니다.</p></div><div className="yg-method-grid"><div><b><span>01</span>DEFINE</b><p>시장 · 고객 · 목표<br/>성장 기회 정의</p></div><div><b><span>02</span>DESIGN</b><p>메시지 · 구매 동인<br/>고객 여정 설계</p></div><div><b><span>03</span>ACTIVATE</b><p>콘텐츠 · 경험<br/>디지털 · 현장 실행</p></div><div><b><span>04</span>OPTIMIZE</b><p>매출 · Account 분석<br/>예산 · 영업정책 조정</p></div><div><b><span>05</span>GROW</b><p>고객 · 파트너 관계<br/>포트폴리오 확장</p></div></div></section>
<div className="yg-closing"><strong>DESIGN THE JOURNEY.<br/>CONNECT THE BUSINESS.</strong><p>채널 운영을 넘어, 고객의 판단과 구매를 만드는<br/>Product · Content · Experience · Sales의 연결.</p></div>
</article>;
}
