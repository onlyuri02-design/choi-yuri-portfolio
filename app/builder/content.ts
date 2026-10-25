import { chapters } from "../portfolio-data";
export const framework = ["Goal","Constraint","Root Cause","Business Model","Execution","Measurement"];
export const principles = [
["01","DEFINE SUCCESS FIRST.","무엇을 성과로 볼 것인지부터. 목표에 맞춘 제품과 사업 구조."],
["02","CONSTRAINT BEFORE OPTIMIZATION.","성장을 막는 조건부터 확인. 제품·채널·원가·조직 중 우선 풀어야 할 문제."],
["03","ROOT CAUSE BEFORE TACTICS.","눈에 보이는 현상과 실제 원인의 구분. 원인에 맞는 실행 방법."],
["04","BUSINESS BEFORE BRANDING.","사업 모델과 고객 경험, 수익 구조를 바탕으로 한 브랜드."],
["05","EXECUTION IS STRATEGY.","담당자·일정·예산·파트너까지 구체화한 실행 계획."]
];
export const thinking=[
["RESEARCH","시장·의료진 VOC·제품 물성·어카운트 데이터 검토","MARKET / CUSTOMER / DATA"],
["HYPOTHESIS","제품 구성·포지셔닝·판매채널별 대안 비교","PRODUCT / PORTFOLIO"],
["CHALLENGE","원가·생산·현장 사용성에 대한 실무 검토","P&L / FEASIBILITY"],
["DECISION","SKU·가격·번들 정책 및 출시 우선순위 결정","PRIORITY / TRADE-OFF"],
["EXECUTION","OEM/ODM·브랜드·영업 조직과 출시 진행","CROSS-FUNCTIONAL"],
["LEARNING","매출 추이·수익성에 따른 제품 구성과 예산 조정","MEASUREMENT / REFINEMENT"]
];
export const decisions=[
["01","PORTFOLIO, NOT PRODUCTS.","제품군별 역할을 구분한 운영. 성장·유지·신규 도입·디마케팅의 우선순위.","DKMA","#dkma"],
["02","BUILD THE BUNDLE.","어카운트별 구매 패턴을 기준으로 한 다빈도 제품 번들·구매 약정.","BUSINESS STRATEGY","#business-strategy"],
["03","OWN THE ECONOMICS.","매출부터 배부 전 영업이익까지의 손익 관리. 신제품 3–5개년 시나리오·손익분기점 검토.","P&L MANAGEMENT","#profitability"],
["04","EXPLORE GLOBAL MARKETS.","북미 의료진 자문과 영국·유럽 현지 시장 검토. 신규 뷰티 브랜드의 제품·채널별 진입 가능성.","IN DEVELOPMENT","#madeca-labs"]
];
const get=(id:string)=>{
  const project=chapters.flatMap(c=>c.projects).find(p=>p.id===id)!;
  // Select existing edge-to-edge campaign imagery for B's featured stories.
  const first=id==="madeca-md"?1:id==="chaeum"?2:0;
  return {...project,images:[project.images[first],...project.images.filter((_,i)=>i!==first)]};
};
export const featured=[
{project:get("dkma"),goal:"메디컬에스테틱 사업 포트폴리오의 성장",scope:"필러·톡신·스킨부스터·코스메슈티컬",execution:"제품별 전략, 손익·예산 및 유관부서 협업 총괄",result:"2023-2025 SALES CAGR 64.7% · 2025 SALES TARGET ACHIEVEMENT 108%"},
{project:get("madeca-md"),goal:"병·의원 채널을 위한 제품군 구축",scope:"Cream 80mL·250mL / Lotion 200mL·500mL / Madeca MD PDRN · 총 5종",execution:"시장 분석부터 컨셉·가격·OEM·출시·운영까지 리드",result:"Madeca MD 운영 기반 확보 · Madeca Labs 개발로 확장"},
{project:get("chaeum"),goal:"HA 필러 브랜드의 성장",scope:"Pure·Premium 라인 및 제품 수명주기",execution:"의료진 VOC·물성 데이터를 제품 개선과 영업 콘텐츠에 연결",result:"2014–2017 매출 CAGR 약 48.1%"},
{project:get("wellage"),goal:"메디컬 전문성의 컨슈머 뷰티 확장",scope:"초기 브랜드 컨셉·네이밍·제품기획",execution:"히알루론산 캡슐 및 시술 후 케어 제품 개발 참여",result:"초기 브랜드 개발 참여 · 소비자 언어로 전문성 전환"},
{project:get("yuriyuri"),goal:"런던 기반 독립 남성복 브랜드 구축",scope:"제품·소재·생산·브랜딩·디지털·홀세일",execution:"컬렉션 개발, 쇼룸 운영과 글로벌 바이어 네트워크 구축",result:"10개국 이상 판매망 · London / Paris / Munich"}
];
export const systems=[
["01","PRODUCT STRATEGY","시장·VOC → 컨셉·SKU → 제품 수명주기"],
["02","BRAND BUILDING","사업 방향 → 네이밍·포지셔닝 → 비주얼"],
["03","GO-TO-MARKET","시장·채널 → 론칭 → 의료진·소비자 접점"],
["04","P&L MANAGEMENT","매출 → 원가·예산 → 수익성 관리"],
["05","OEM / ODM","제형·소재 → 생산·품질 → 제품화"],
["06","GLOBAL RETAIL","자사몰 → 쇼룸·바이어 → 글로벌 유통"],
["07","ORGANIZATION","목표 → 역할·파트너 → 협업과 실행"],
["08","COMMUNICATION","제품 특성 → 콘텐츠 → 학술·브랜드 경험"]
];
export const experience=[
["2023 — PRESENT","DONGKOOK PHARMACEUTICAL","TEAM LEAD","메디컬에스테틱·더마코스메슈티컬 포트폴리오 총괄. 4인 팀원 운영, 제품·브랜드·손익·출시 및 유관부서 협업."],
["2018 — 2023","YURI&YURI LONDON","OWNER & FOUNDER","런던 남성복 브랜드 창업. 디자인·소재·생산·아트 디렉션·디지털·홀세일 전 과정 운영."],
["2014 — 2017","HUGEL PHARMA","MAIN PRODUCT MANAGER","더채움·블루로즈 메인 PM, 웰라쥬 초기 개발 및 보툴렉스 AM. AM 2인 협업·운영."]
];
