import {Children,cloneElement,isValidElement,type ReactNode} from 'react';
import {MobileDisclosure,useMobileLayout} from './mobile-disclosure';
import {CompanyCI} from './company-ci';
type Metric = { value: string; unit?: string; label: string; detail?: string | string[]; credential?: string };

function CareerRow({children,labelledBy}:{children:ReactNode;labelledBy:string}) {
 const mobile=useMobileLayout();
 if(!mobile)return <article className="career-row" aria-labelledby={labelledBy}>{children}</article>;
 const [image,main,responsibilities]=Children.toArray(children);
 if(!isValidElement<{children:ReactNode}>(main))return null;
 const parts=Children.toArray(main.props.children);
 const isDetail=(part:ReactNode)=>isValidElement<{className?:string}>(part)&&['career-description','career-evidence','career-authority'].includes(part.props.className||'');
 return <article className="career-row" aria-labelledby={labelledBy}>
  {image}{cloneElement(main,{},parts.filter(part=>!isDetail(part)))}
  <MobileDisclosure title="경력 상세 / 설명·수행 범위">{parts.filter(isDetail)}{responsibilities}</MobileDisclosure>
 </article>;
}

function Metrics({ items, secondary = false }: { items: Metric[]; secondary?: boolean }) {
  return <dl className={`career-metrics${secondary ? ' career-metrics-secondary' : ''}`}>
    {items.map(item => <div key={item.value + item.label}>
      <dt>{item.label}{item.detail && (Array.isArray(item.detail) ? item.detail : [item.detail]).map(line => <span key={line}>{line}</span>)}{item.credential && <span className="career-metric-credential">{item.credential}</span>}</dt>
      <dd>{item.value}{item.unit && <small>{item.unit}</small>}</dd>
    </div>)}
  </dl>;
}

function Responsibilities({ items, href, label, highlightedItem }: { items: string[]; href: string; label: string; highlightedItem?: string }) {
  return <aside className="career-responsibilities" aria-label={`${label} 주요 역할`}>
    <h4>KEY RESPONSIBILITIES</h4>
    <ul>{items.map(item => <li key={item}>{item === highlightedItem ? <mark>{item}</mark> : item}</li>)}</ul>
    <a href={href} aria-label={`${label} 사업 사례 보기`}>View case study <span aria-hidden="true">↗</span></a>
  </aside>;
}

export default function CareerSummary() {
  return <section className="revision-career career-summary" aria-labelledby="career-heading">
    <div className="career-summary-heading">
      <div><span className="f-kicker">PUBLIC CAREER SUMMARY</span>
        <h2 id="career-heading">Career.<br/>Responsibility.<br/><mark>Results.</mark></h2>
      </div>
      <div className="career-positioning"><span>BRAND &amp; BUSINESS BUILDER</span>
        <p>Building brands across<br/>Beauty, Fashion &amp; Lifestyle —<br/>from product to business.</p>
      </div>
    </div>

    <CareerRow labelledBy="career-dongkook">
      <figure className="career-image career-image-dongkook"><img src="/portfolio/september-update/cv-dongkook-building.png" alt="동국제약 사옥" loading="lazy"/><span aria-hidden="true">01</span><figcaption>PORTFOLIO &amp; P&amp;L</figcaption></figure>
      <div className="career-main">
        <header className="career-company career-company-dongkook"><h3 id="career-dongkook">DONGKOOK PHARMACEUTICAL</h3><span className="career-tenure-logo">2023–현재<CompanyCI company="dongkook"/></span></header>
        <p className="career-role">메디컬 에스테틱 포트폴리오·제품·사업 운영 / 팀 리드</p>
        <p className="career-description">Madeca MD 5종 포함 총 26개의 SKU 포트폴리오 구성과 운영. 매출부터 배부 전 영업이익까지 손익을 검토하고, 가격정책·프로모션·번들링·채널·고객군을 결정합니다.</p>
        <Metrics items={[
          {value:'64.7%',label:'매출 CAGR',detail:'2023–2025'},
          {value:'108%',label:'매출 목표 달성률',detail:'2025'},
          {value:'26',unit:'SKU',label:'메디컬 에스테틱',detail:'포트폴리오 운영'},
        ]}/>
        <Metrics secondary items={[
          {value:'6–10%p',label:'원가율 인하',detail:'별도 Bellast 패키지 4% 절감'},
          {value:'4명',label:'팀원 직속 관리',detail:'2023–2026'},
          {value:'6명',label:'직접 채용 누적'},
        ]}/>
        <p className="career-evidence">팀원 임원평가 A등급 1명 · ‘응형무궁’ 포상 후보 추천 2명<br/>영업팀 팀장급 후보 2명 추천 · 모두 채용, 현재까지 재직 중</p>
        <p className="career-authority">영업·마케팅 예산 집행 및 신제품·투자 검토·제안 담당.</p>
      </div>
      <Responsibilities label="DKMA" href="/case/dkma" highlightedItem="조직 구축·연간 KPI·분기별 OKR·인사평가·성과관리" items={[
        '제품·브랜드 기획 및 출시',
        '대규모 런칭 심포지엄 총괄',
        '매출·손익·가격 정책 수립',
        '프로모션·채널·고객군 전략',
        '연간 영업·마케팅 예산 집행·관리 (2025)',
        '신제품·투자 검토 및 제안',
        '조직 구축·연간 KPI·분기별 OKR·인사평가·성과관리',
      ]}/>
    </CareerRow>

    <CareerRow labelledBy="career-yuriyuri">
      <figure className="career-image career-image-yuriyuri"><img src="/cover-final/yuriyuri-sign.png" alt="런던 Savile Row의 YURI&YURI 브랜드 사인" loading="lazy"/><span aria-hidden="true">02</span><figcaption>BRAND &amp; GLOBAL BUSINESS</figcaption></figure>
      <div className="career-main">
        <header className="career-company"><h3 id="career-yuriyuri">YURI&amp;YURI · LONDON</h3><span>2018–2023<small>이후 유지 운영</small></span></header>
        <p className="career-role">Founder &amp; Brand Director</p>
        <p className="career-description">브랜드 창업부터 컬렉션 기획·디자인·패턴·생산·커머스·가격·유통·손익까지 직접 운영. 런던·파리·뮌헨 쇼룸과 해외 바이어 협업으로 글로벌 유통을 확장했습니다.</p>
        <Metrics items={[
          {value:'2019',label:'브랜드 공식 론칭',detail:['London Savile Row Street','UK Company House','Member of British Fashion Council']},
          {value:'10+',label:'COUNTRIES',detail:'판매·유통 접점'},
          {value:'GLOBAL',label:'런던 · 파리 · 뮌헨',detail:'쇼룸·해외 바이어 협업',credential:'English · OPIc AL'},
        ]}/>
        <Metrics secondary items={[
          {value:'Savile Row Academy',label:'Master Tailoring 수료',detail:'한국인 최초'},
          {value:'2020–2023',label:'Member of the',detail:'British Fashion Council'},
        ]}/>
      </div>
      <Responsibilities label="YURI&YURI" href="/case/yuriyuri" items={[
        '브랜드·컬렉션 기획 및 디자인',
        '패턴·생산·가격 전략',
        'DTC·글로벌 유통 운영',
        '쇼룸·바이어 커뮤니케이션',
        '브랜드 마케팅 및 콘텐츠',
        '손익 관리 및 사업 운영',
      ]}/>
    </CareerRow>

    <CareerRow labelledBy="career-hugel">
      <figure className="career-image career-image-hugel"><img src="/portfolio/september-update/cv-hugel-campaign.png" alt="휴젤 브랜드 캠페인 광고" loading="lazy"/><span aria-hidden="true">03</span><figcaption>PRODUCT &amp; BRAND GROWTH</figcaption></figure>
      <div className="career-main">
        <header className="career-company career-company-hugel"><h3 id="career-hugel">HUGEL PHARMA</h3><span className="career-tenure-logo">2014–2017<CompanyCI company="hugel"/></span></header>
        <p className="career-role">THE CHAEUM 메인 PM · 브랜드·제품 성장</p>
        <p className="career-description">휴젤의 성장기와 코스닥 상장 전환기를 경험하며 HA Filler 더채움의 브랜드·제품 성장을 담당. 포지셔닝·시그니처 패키지·학술 콘텐츠·SKU 확장을 연결하고, 업계 최초 남성 모델을 기용한 브랜드 커뮤니케이션을 실행했습니다.</p>
        <Metrics items={[
          {value:'48.1%',label:'더채움 매출 CAGR (약)',detail:'2014–2017'},
          {value:'50%',label:'시린지 디자인',detail:'특허 지분'},
          {value:'BRAND GROWTH',label:'BELUROSE · BOTULAX',detail:'WELLAGE 제품 경험'},
        ]}/>
      </div>
      <Responsibilities label="THE CHAEUM" href="/case/chaeum" items={[
        '브랜드·제품 전략 수립',
        '포지셔닝·패키지·학술 콘텐츠',
        'H.E.L.F 심포지엄 실무담당',
        'SKU 확장 및 라인업 운영',
        '브랜드 커뮤니케이션 IMC & CX 기획 및 운영',
        '업계 최초 남성 모델 캠페인',
        '코스닥 상장 전환기 경험',
      ]}/>
    </CareerRow>
  </section>;
}
