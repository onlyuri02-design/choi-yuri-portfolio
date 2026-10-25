export function LeadershipOwnership(){return <section className="revision-ownership"><span className="f-kicker">ORGANIZATION & PEOPLE / 2023–2026</span><h2>Build the team. Develop the people.</h2><p><b>팀원 4명 직속 관리</b> · 조직 구축·업무 분장·팀빌딩부터 개별 연간 KPI 설계, 분기별 OKR·인사평가·성과관리까지.</p><dl><div><dt>직접 채용</dt><dd><b>누적 6명</b></dd></div><div><dt>육성·평가</dt><dd>팀원 중 임원평가 <b>A등급 1명</b></dd></div><div><dt>포상 후보 추천</dt><dd><b>‘응형무궁’ 2명</b> · 성과자 대상 후보 추천</dd></div><div><dt>조직 간 채용 연결</dt><dd>영업팀 팀장급 후보 <b>2명 추천 · 모두 채용 및 현재 팀장직으로 재직 중</b></dd></div><div><dt>예산 관리</dt><dd><b>연간 영업·마케팅 예산 관리 · 2025</b><br/>영업·마케팅 예산 집행 및 투자 우선순위 검토·제안.</dd></div></dl></section>}

export function BusinessDecisions(){return <section className="revision-ownership"><span className="f-kicker">COMMERCIAL DECISIONS IN PRACTICE</span><h2>제품의 역할을 바꾸고, 수익구조를 개선하다.</h2><ol className="revision-decisions">{[
 ['Demarket','매출이 낮고 Lifecycle이 긴 제품의 디마케팅을 판단해 포트폴리오 수익성을 개선.'],
 ['Improve the Cash Cow','핵심 매출 제품의 원가구조를 분석하고, 패키지 소재·디자인 리뉴얼로 원가율 개선.'],
 ['Rebalance the Mix','원가율이 높은 제품과 고마진 제품을 번들링해 수익성과 SKU 매출 구성의 균형을 개선.'],
 ].map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></section>}

export function CostProposal(){return <figure className="revision-cost"><figcaption><b>PROCESS AUTOMATION / 검토안</b><span>QC 비용 제외 원가 · 현재 기준 지수 100</span></figcaption><div className="revision-cost-row"><span>현재</span><div style={{width:'100%'}}><b>100</b></div></div><div className="revision-cost-row"><span>개선안</span><div style={{width:'50%'}}><b>50</b></div></div><p>원가 50% 절감 방안 제안 · <b>실현 성과가 아닌 검토안</b></p></figure>}

export function CaseOverview({period,role,problem,decision,result,archive}:{period:string;role:string;problem:string;decision:string;result:string;archive:string}){return <dl className="revision-case-overview">{[['PERIOD',period],['ROLE / SCOPE',role],['PROBLEM',problem],['DECISION / EXECUTION',decision],['RESULT / SCOPE',result]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}<div><dt>ARCHIVE</dt><dd><a href={archive}>관련 작업 아카이브 ↗</a></dd></div></dl>}
