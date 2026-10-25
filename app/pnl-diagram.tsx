import "./pnl-diagram.css";

const steps=[
  {title:"Revenue",label:"매출 추정·목표 설정",formula:"Volume × ASP",output:"예상 매출",detail:"예상 판매량 × 평균 판매가격. 신제품의 시장 침투율과 가격 탄력성을 반영한 매출 시나리오."},
  {title:"Cost of goods",label:"매출원가 반영",formula:"Revenue − COGS",output:"Gross profit / 매출총이익",detail:"생산·원재료·포장 등 매출에 대응하는 원가를 차감해 제품의 매출총이익 산출."},
  {title:"Operating costs",label:"마케팅·영업비용 산정",formula:"Marketing + Sales + Overhead",output:"OPEX / 영업비용",detail:"광고·프로모션·인건비·채널 운영비 등 실행에 필요한 비용과 고정비 예산 반영."},
  {title:"Profit & break-even",label:"영업이익·손익분기점 검토",formula:"Gross profit − OPEX",output:"Operating profit / 영업이익",detail:"예상 영업이익, 손익분기점과 목표 ROI 검토. 비용 회수 가능성을 기준으로 실행안 비교."}
];
const decisions=[
  {title:"Allocate",label:"예산 배분",detail:"채널별 공헌이익을 비교해 수익 기여도가 높은 채널에 예산 배분.",check:"CHANNEL CONTRIBUTION"},
  {title:"Price & promote",label:"가격·프로모션",detail:"할인·판촉으로 늘어나는 이익과 추가 집행비를 비교한 시나리오 검토.",check:"INCREMENTAL PROFIT"},
  {title:"Launch",label:"신제품·라인 확장",detail:"초기 론칭·샘플링 비용과 예상 현금흐름을 바탕으로 투자 회수 기간 검토.",check:"PAYBACK PERIOD"},
  {title:"Review",label:"성과 평가",detail:"실제 매출·비용을 초기 계획과 비교하고, 차이의 원인을 다음 예산에 반영.",check:"PLAN vs. ACTUAL"}
];
export function PnlDiagram(){return <section className="pnl-diagram" aria-labelledby="pnl-process-title">
  <header className="pnl-heading"><span>P&amp;L / DECISION FRAMEWORK</span><h4 id="pnl-process-title">From revenue<br/><em>to return.</em></h4><p>비용 집행을 넘어, 브랜드와 제품의 수익 기여도를 판단하는 과정.</p></header>
  <ol className="pnl-process" aria-label="손익 분석 4단계">{steps.map((s,i)=><li key={s.title}><div className="pnl-step-top"><span>0{i+1}</span>{i<3&&<span className="pnl-arrow" aria-hidden="true">→</span>}</div><h5>{s.title}</h5><b>{s.label}</b><p>{s.detail}</p><div className="pnl-equation"><span>{s.formula}</span><strong>{s.output}</strong></div></li>)}</ol>
  <div className="pnl-bep"><span>BREAK-EVEN POINT</span><p><b>손익분기 판매량</b> = 고정비 ÷ 단위당 공헌이익</p><small>단위당 공헌이익 = 단위 판매가격 − 단위 변동비 · 단일 제품 또는 고정된 제품 믹스 기준</small></div>
  <header className="pnl-decisions-heading"><h5>What the numbers inform.</h5><span>실무 의사결정</span></header>
  <div className="pnl-decisions">{decisions.map((d,i)=><article key={d.title}><span className="pnl-decision-number">0{i+1}</span><div><h6>{d.title}</h6><b>{d.label}</b><p>{d.detail}</p><small>{d.check}</small></div></article>)}</div>
  <footer className="pnl-notes"><p>일반적인 손익 검토 프로세스. 개별 기업의 실적·원가·예산 수치는 포함하지 않음.</p><p>물류·배송비·채널 수수료의 분류는 회계정책에 따르며, 고정비를 포함한 각 비용은 한 번만 반영.</p></footer>
</section>}
