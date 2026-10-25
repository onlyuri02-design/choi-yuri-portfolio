export const costReduction = '6–10%p';
export const commercialDecisions = [
 ['GROW','Sales Growth × Margin Quality','매출 성장·매출총이익·공헌이익·원가율의 통합 검토'],
 ['OPTIMIZE','COGS · Price · Mix · Budget','원가·가격·SKU Mix·직접비 조정을 통한 수익구조 개선'],
 ['DECIDE','Contribution · Fixed-cost Absorption · BEP','단독 손익·공헌이익·고정비 흡수효과 기반 유지·조정·철수 판단'],
 ['SCALE / EXIT','ROI · Inventory · Growth Potential','성장성·재고효율 기반 SKU 확대·유지·프로모션·디마케팅 결정'],
];
export function CommercialFramework(){return <section className="v-commercial" aria-labelledby="commercial-title"><header><span className="f-kicker">P&L / COMMERCIAL DECISION FRAMEWORK</span><h2 id="commercial-title">From P&L to<br/><mark>Portfolio Action.</mark></h2><p>매출 성장과 수익성의 균형에 기반한 사업 판단</p></header><ol>{commercialDecisions.map(([title,scope,text],i)=><li key={title}><b>0{i+1}</b><div><h3>{title}</h3><p className="v-commercial-scope">{scope}</p><p>{text}</p></div></li>)}</ol></section>}
export function CostReduction(){return <div className="v-cost-result"><span className="f-kicker">COST RATIO REDUCTION</span><strong>{costReduction}<span> ↓</span></strong><p>기존 원가율 대비 인하 폭</p></div>}
