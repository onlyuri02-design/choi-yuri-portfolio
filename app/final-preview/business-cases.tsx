import { chapters } from '../portfolio-data';
import { ModelStory } from './model-story';
import { CaseOverview, BusinessDecisions, CostProposal } from './ownership';
import { CostReduction } from './commercial-framework';
import { companyArchiveFor } from './company-archives';
import {MobileDisclosure} from './mobile-disclosure';

export const businessCases = [
 {id:'madeca-md',category:'PRODUCT DECISION',title:'MADECA MD',subtitle:'제품 기획부터 출시·운영, 성상 개선까지',statement:'From Concept to Operation.',logic:['Concept','Price / Cost','OEM / Launch','Product Improvement'],metric:'5종',metricLabel:'MADECA MD PORTFOLIO',
 problem:'병·의원 채널에 맞는 제품 구성과 상품화 조건을 설계하고, 출시 이후 성상 이슈까지 관리할 필요.',
 insight:'컨셉·가격·원가·OEM 생산을 연결한 상품화 판단과, 실제 운영에서 확인한 성상 분리 이슈에 대한 연구소·생산 협업.',
 decisions:['Madeca MD Cream 80mL·250mL / Lotion 200mL·500mL / Madeca MD PDRN 총 5종 기획·운영','시장 분석 기반 컨셉·가격·원가 검토 및 상품화 의사결정','OEM 생산·출시·운영의 E2E 관리','성상 분리 이슈 확인 후 온도별 보관 조건 검토 요청','성상 유지 온도 범위 확대를 위한 개선 방향 설정'],
 execution:'자사 연구소와 OEM 생산 파트너의 협업을 연결. 성상 변화 검토를 요청하고 개선 방향을 설정해 제품 성상 변경으로 연결.',
 impact:['Madeca MD 5종 포트폴리오 기획·출시·운영','컨셉·가격·원가·OEM을 연결한 E2E 운영','성상 유지 온도 범위 확대 방향에 따른 제품 성상 변경'],
 note:''},
 {id:'chaeum',category:'PRODUCT DECISION',title:'THE CHAEUM',subtitle:'경쟁 분석 기반 시장 포지셔닝 및 브랜드 차별화',statement:'Product & Brand Differentiation.',logic:['Competition','Positioning','Visual Identity','Portfolio Expansion'],metric:'48.1%',metricLabel:'2014–2017 SALES CAGR',
  problem:'경쟁 제품이 빠르게 증가하던 HA 필러 시장에서 후발 브랜드의 명확한 시장 포지셔닝과 제품·브랜드 차별화 필요.',
  insight:'제품력만으로는 차별화가 어려운 경쟁 환경. 제품 물성의 차별적 특성과 시각적·커뮤니케이션적 기억점을 결합한 시장 포지셔닝 필요.',
  decisions:['경쟁 제품·시장 포지셔닝 분석','Rheology 기반 제품 특성의 차별화 포인트 구조화','강렬한 Red 기반 시그니처 패키지·브랜드 아이덴티티 구축','업계 최초 남성 모델 기용과 TV 캠페인을 포함한 IMC 기획·운영','시린지 디자인 및 사용성 개선','대용량·Body Application 등 SKU 확장을 통한 포트폴리오 강화'],
  execution:'제품 물성의 차별점과 프리미엄 브랜드 포지셔닝을 공통 메시지의 기준으로 삼아, TV·라디오·OOH(옥외광고)·모델 캠페인, 학술·의료진 커뮤니케이션, 영업 지원을 연결. 제품기획·개발·디자인·학술·KOL/HCP·영업조직과 협업하며 제품 특성 → 패키지 → Scientific Communication → Brand Campaign → Sales Enablement로 이어지는 IMC를 실행.',
  impact:['2014–2017 매출 CAGR 약 48.1%','HA Filler SKU·Application 포트폴리오 확대','시린지 디자인 특허 등록 / 지분 50%','제품 특성·Visual Identity·Communication을 연결한 브랜드 차별화 체계 구축'],
  note:''},
 {id:'dkma',category:'ECONOMIC DECISION',title:'DKMA',subtitle:'포트폴리오 수익성 기반 투자 의사결정',statement:'Portfolio Profitability.',logic:['P&L','Contribution','Portfolio Role','Investment Decision'],metric:'6–10%p',metricLabel:'COST RATIO REDUCTION',
  problem:'개별 매출 성장만으로 사업 전체 수익성을 판단하는 방식의 한계. 성장·유지·신규 도입·디마케팅 대상별 역할 구분 기준의 필요.',
  insight:'개별 Full P&L을 넘어선 SKU 가치 판단. 원가·공헌이익·고정비 흡수·포트폴리오 역할·중장기 성장 가능성의 통합 검토.',
  decisions:['Madeca MD 5종 포함 총 26개의 SKU 포트폴리오 구성과 운영','SKU별 수익성과 포트폴리오 역할 검토','Grow / Maintain / Introduce / Demarket 우선순위 설정','신규 제품 3–5년 Sales Forecast와 BEP 검토','원가·가격구조의 통합 검토','성장 가능성이 높은 제품·프로젝트 중심으로 투자 우선순위 검토·제안 및 예산 집행'],
  execution:'Marketing 중심의 Sales·BD·R&D·Development·Production 협업. 매출·원가·예산·제품 포트폴리오를 연결한 의사결정. 가격정책·프로모션·번들링·채널·타깃 고객군을 결정하고 영업·마케팅 예산을 집행.',
  impact:['2023–2025 매출 CAGR 64.7%','2025 매출 목표 달성률 108%','26 SKU 포트폴리오 수익성 관리 체계화','기존 원가율 대비 6–10%p 인하','성장·유지·신규 도입·디마케팅 기준 정립','포트폴리오 성장과 함께 사업 수익구조 관리'],
  note:''},
 {id:'madeca-labs',category:'BUSINESS DECISION',title:'MADECA LABS',subtitle:'Medical Insight 기반 Consumer Beauty 사업 개발',statement:'New Business Development.',logic:['Market Opportunity','Product / Price / OEM','Global Channel'],metric:'0 → 1',metricLabel:'IN DEVELOPMENT · DEVELOPMENT SCOPE',
  problem:'메디컬 뷰티와 병·의원 스킨케어 경험의 컨슈머 뷰티 확장을 위한 신규 성장 기회 검토.',
  insight:'Madeca MD의 clinic-facing skincare 경험과 동국제약의 healthcare·ingredient 자산 기반. 시술 후 관리에서 daily skincare로의 확장 가능성 검토.',
  decisions:['신규 뷰티 브랜드 컨셉·포지셔닝 설계','초기 제품 포트폴리오 구성','경쟁 제품과 시장가격 분석','목표 가격·원가구조 검토','OEM/ODM 기반 제품개발 구조 설계','북미·영국·유럽 시장의 제품·채널 적합성 검토'],
  execution:'시장·경쟁사 분석부터 컨셉·SKU·가격·원가·OEM/ODM 제품개발까지 0→1 과정 참여. 북미 의료진 자문 및 해외 시장 관점의 확장 가능성 검토.',
  impact:['신규 뷰티 사업·브랜드 개발 진행 중','Market → Concept → Product → Price / Cost → OEM / ODM → Channel → Market Entry'],
  note:'개발 범위 중심의 사례. 매출 성과·시장 성공과 별개. 미공개 제형·제조사·내부 원가·출시 일정·예측치 비공개.'},
];
export function Emphasis({text}:{text:string}){return <>{text.split(/(\d+(?:[.,]\d+)*(?:%|\+)?)/g).map((s,i)=>i%2?<b key={i}>{s}</b>:s)}</>}
export function LogicFlow({steps}:{steps:string[]}){return <ol className="r-logic">{steps.map((s,i)=><li key={s}><span>{s}</span>{i<steps.length-1&&<span aria-hidden="true">→</span>}</li>)}</ol>}
export function CaseLinks(){return <div className="r-case-links">{businessCases.map((c,i)=><a href={'/case/'+c.id} key={c.id}><span className="f-kicker">0{i+1} / {c.category}</span><h3>{c.title}</h3><p>{c.statement}</p><span className="r-case-link-bottom">View case <span>↗</span></span></a>)}</div>}
const caseHeadings:Record<string,string[]> = {
 'madeca-md':['상품화부터 운영까지의 연결','상품화 판단과 운영 이슈의 통합 검토','5종 포트폴리오와 성상 개선 방향','연구소·OEM 생산 협업','제품 운영 범위와 성상 개선'],
 chaeum:['경쟁 시장 내 차별적 포지셔닝 필요','제품 특성과 브랜드 인상의 결합','Product × Brand 차별화 전략','제품 차별화를 시장 인지도와 영업 접점으로 연결한 IMC','차별적 포지셔닝의 사업 성장 연결'],
 dkma:['매출 중심 판단의 한계','공헌이익과 포트폴리오 역할','투자 우선순위의 재정의','매출·원가·예산의 통합 운영','수익성 관리 기준의 체계화'],
 'madeca-labs':['컨슈머 뷰티의 신규 성장 기회','메디컬 경험과 스킨케어의 접점','시장·제품·가격·개발 구조 설계','시장 검토부터 OEM/ODM 개발까지','신규 뷰티 사업 개발 진행 중'],
};
function ChaeumHero({steps,image}:{steps:string[];image:string}){
 const pillars=[
  {label:'PRODUCT EXPERIENCE',title:'Syringe Redesign\n& Patent',items:['사용성과 안정성을 고려한 시린지 디자인 개발','시린지 디자인 특허 출원 및 등록 (포상금 수령, 지분 50%)','패키지 개봉 UX를 차별화한 지기구조 도입']},
  {label:'PRODUCT PORTFOLIO',title:'Rheology →\nSKU Expansion',items:['물성 기반 제품 특성 정의 (Rheology Control)','대용량 및 바디용 등 포트폴리오 확장','의료진 사용 목적에 따른 제품 선택 구조 강화']},
  {label:'BRAND COMMUNICATION',title:'IMC Strategy\n& Campaign',items:['제품 차별화·프리미엄 포지셔닝 기반 IMC 기획·운영','업계 최초 남성 모델 기용 및 TV 캠페인 실행','학술·의료진 커뮤니케이션과 소비자 캠페인·영업 지원 연결']},
 ];
 return <div className="md-case-hero ch-case-hero"><div className="md-case-copy"><LogicFlow steps={steps}/><h2 className="r-statement">Product &amp; Brand Differentiation.</h2><div className="md-case-pillars">{pillars.map((pillar,i)=><section key={pillar.label}><span className="md-pillar-number">0{i+1}</span><p className="md-pillar-label">{pillar.label}</p><h3>{pillar.title}</h3><ul>{pillar.items.map(item=><li key={item}>{item}</li>)}</ul></section>)}</div><div className="ch-case-result"><strong>48.1%</strong><span>2014–2017<br/>SALES CAGR</span><div className="ch-market-share"><strong>1위</strong><span>Market Share</span></div></div><a className="r-read-case" href="/case/chaeum/details">Read the decision ↓</a></div><img src={image} alt="THE CHAEUM 빨간 시그니처 패키지 제품 이미지"/></div>;
}
function MadecaHero({steps,image}:{steps:string[];image:string}){
 const pillars=[
  {label:'PORTFOLIO DESIGN',title:'병·의원 전용 포트폴리오 설계',items:['병·의원 채널 사용환경 기반 제품 구성','Cream · Lotion · PDRN 총 5종 SKU 포트폴리오 설계','용량별·사용 목적별 SKU 아키텍처 구축']},
  {label:'COMMERCIAL DESIGN',title:'가격·원가·상품화 전략',items:['원가 구조 분석 및 가격 전략 수립','병·의원 전용 상품화 조건 설계','OEM 파트너 선정 및 생산·출시 조건 조율']},
  {label:'PRODUCT LIFECYCLE',title:'출시 및 운영·개선',items:['OEM·연구소·유관부서 Cross-functional 협업','출시 및 초기 운영','출시 후 성상 이슈 대응 및 제품 개선']},
 ];
 return <div className="md-editorial md-summary">
  <div className="md-summary-copy">
   <LogicFlow steps={steps}/>
   <h2>From Concept to<br/>Operation.</h2>
   <div className="md-summary-pillars">{pillars.map((pillar,i)=><section key={pillar.label}>
    <span className="md-pillar-number">0{i+1}</span>
    <p className="md-pillar-label">{pillar.label}</p>
    <h3>{pillar.title}</h3>
    <ul>{pillar.items.map(item=><li key={item}>{item}</li>)}</ul>
   </section>)}</div>
   <dl className="md-summary-metrics">
    <div><dt>HOSPITAL-EXCLUSIVE PORTFOLIO</dt><dd>0 → 1</dd></div>
    <div><dt>PLANNED · LAUNCHED · OPERATED</dt><dd>5 SKU</dd></div>
   </dl>
   <a className="r-read-case" href="/case/madeca-md/details">Read the decision ↓</a>
  </div>
  <figure className="md-summary-image"><img src={image} alt="MADECA MD 모녀 브랜드 이미지"/></figure>
 </div>;
}
function StoryRow({number,label,title,children,tone='',fold=false}:{number:string;label:string;title:string;children:React.ReactNode;tone?:string;fold?:boolean}) {
 return <MobileDisclosure enabled={fold} title={<span>{number} / {label}<br/>{title}</span>}><article className={'c-story-row '+tone}><div className="c-story-label"><b>{number}</b><h2>{label}</h2></div><div className="c-story-body"><h3>{title}</h3>{children}</div></article></MobileDisclosure>
}
export function BusinessCase({id}:{id:string}){
 const c=businessCases.find(x=>x.id===id);
 if(!c)return <section className="f-content"><h1>Business Cases</h1><CaseLinks/></section>;
 const p=chapters.flatMap(x=>x.projects).find(x=>x.id===id)!;
 const next=businessCases[(businessCases.indexOf(c)+1)%businessCases.length];
 const archive=companyArchiveFor(id);
 const archiveHref=archive?.href||'/project/'+id;
 return <section className={'f-content r-business-case r-case-'+id}>
  <div className="r-case-top"><div><span className="f-kicker">{c.category}{id==='madeca-labs'?' / IN DEVELOPMENT':''}</span><h1>{c.title}</h1>{id==='dkma'&&<p className="r-case-name-expansion">Dongkook Medical Aesthetics</p>}<p className="r-serif-subtitle">{c.subtitle}</p></div><a className="r-blue-link" href={archiveHref}>{id==='chaeum'?'HUGEL Full Archive':id==='dkma'?'DONGKOOK Full Archive':archive?archive.group.title.split(' · ')[0]+' 전체 아카이브':'Product archive'} ↗</a></div>
  <CaseOverview period={id==='chaeum'?'2014–2017 / 성과 2014–2017':p.period} role={id==='dkma'?'포트폴리오·수익성 관리 / 상업적 의사결정·예산 집행·투자 검토 및 제안':id==='madeca-md'?'상품화 의사결정·연구소/OEM 협업·출시 및 운영':id==='chaeum'?'더채움 Pure·Premium 메인 PM / 브랜드·제품 성장':'신규 사업 분석·제품 및 채널 기획'} problem={c.problem} decision={c.decisions[0]} result={c.impact[0]} archive={archiveHref}/>
  {id==='chaeum'&&<p className="r-case-scope">제품 물성 · 시그니처 패키지 · 차별적 커뮤니케이션 · 포트폴리오 확장</p>}
  {id==='madeca-md'?<MadecaHero steps={c.logic} image={p.images[0]}/>:id==='chaeum'?<ChaeumHero steps={c.logic} image={p.images[0]}/>:<><LogicFlow steps={c.logic}/>
  <div className="r-case-hero"><div><p className="r-statement">{c.statement}</p>{id==='dkma'?<><h2 className="r-profit-heading">원가구조 개선과 포트폴리오 성장</h2><p className="r-profit-description">SKU별 원가구조와 제품별 역할을 검토하고, 원가·가격·제품 믹스를 연결해 수익성을 관리. 원가율 개선과 성장·유지·신규 도입·디마케팅 우선순위를 함께 운영.</p><div className="r-profit-metrics"><CostReduction/><div className="r-growth-result"><span className="f-kicker">SALES GROWTH</span><strong>64.7%<span> ↑</span></strong><p>2023–2025 매출 CAGR</p></div></div></>:<strong className="r-metric">{c.metric}</strong>}{id!=='dkma'&&<span className="f-kicker">{c.metricLabel}</span>}{id==='chaeum'&&<p className="r-case-milestone">휴젤의 성장기와 코스닥 상장 전환기를 경험하며, HA Filler 더채움의 브랜드·제품 성장을 담당했습니다.</p>}<a className="r-read-case" href={'/case/'+id+'/details'}>Read the decision ↓</a></div>
   {id==='dkma'?<div className="r-economics" aria-label="Portfolio economics decision framework">{['SALES','VARIABLE COST','CONTRIBUTION','FIXED-COST ABSORPTION','PORTFOLIO ROLE'].map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span>{i<4&&<span className="r-down">↓</span>}</div>)}<p>GROW · MAINTAIN<br/>INTRODUCE · DEMARKET</p></div>:<img src={p.images[0]} alt={c.title+' 대표 프로젝트 이미지'}/>}</div></>}
  <div className="c-case-details" id="case-details">
   <StoryRow fold={id==='chaeum'||id==='madeca-md'} number="01" label="Problem" title={caseHeadings[id][0]}><p>{c.problem}</p></StoryRow>
   <StoryRow fold={id==='chaeum'||id==='madeca-md'} number="02" label={id==='madeca-labs'?'Opportunity':'Insight'} title={caseHeadings[id][1]}><p>{c.insight}</p></StoryRow>
   <StoryRow fold={id==='chaeum'||id==='madeca-md'} number="03" label="Decision" title={caseHeadings[id][2]} tone="is-decision"><ul>{c.decisions.map(x=><li key={x}><Emphasis text={x}/></li>)}</ul>{id==='chaeum'&&<ModelStory/>}{id==='dkma'&&<><BusinessDecisions/><CostProposal/></>}</StoryRow>
   <StoryRow fold={id==='chaeum'||id==='madeca-md'} number="04" label="Execution" title={caseHeadings[id][3]}><p>{c.execution}</p>{id==='chaeum'&&<p><strong>MY ROLE / 메인 PM</strong><br/>브랜드·제품 전략 수립, 포지셔닝·패키지·학술 콘텐츠 기획, 모델 선정 및 브랜드 커뮤니케이션 IMC 기획·운영 담당.</p>}</StoryRow>
   <StoryRow number="05" label={id==='madeca-labs'?'Development Scope':id==='madeca-md'?'Result / Scope':'Impact'} title={caseHeadings[id][4]} tone="is-impact"><ul>{c.impact.map(x=><li key={x}><Emphasis text={x}/></li>)}</ul></StoryRow>
   {c.note&&<p className="f-note">{c.note}</p>}
  </div>
  <nav className="f-project-bottom"><a href="/process/cases">← Selected Business Cases</a><a href={'/case/'+next.id}>Next / {next.title} ↗</a></nav>
 </section>
}
