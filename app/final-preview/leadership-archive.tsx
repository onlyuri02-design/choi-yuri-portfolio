import type { ReactNode } from 'react';
import type { Project } from '../portfolio-data';
import { ProjectCaseStudy } from './project-case-study';
import {MobileDisclosure} from './mobile-disclosure';

export default function LeadershipArchive({project, gallery, embedded=false}:{project:Project;gallery:ReactNode;embedded?:boolean}){
 return <section className={(embedded?'f-project':'f-content f-project')+' leadership-archive'}>
  <header className="f-project-intro">
   <div className="f-kicker">{project.organization} <span>/ {project.period}</span></div>
   <h1>{project.title.replace(/\n/g,' ')}</h1>
   <p className="f-project-subtitle">{project.subtitle}</p>
  </header>
  <p className="f-description leadership-intro">{project.description}</p>
  <section className="leadership-markets" aria-labelledby="across-markets">
   <header className="leadership-section-heading"><span className="f-kicker">01 / ACROSS MARKETS</span><h2 id="across-markets">글로벌 파트너 협업</h2><p>Connecting partners. Building across markets.</p></header>
   <div className="f-case-layout">
    <div className="f-case-copy">
     <p className="f-description">런던에서 독립 남성복 브랜드를 운영하며, 상품의 제작부터 쇼룸·바이어 접점과 브랜드 커뮤니케이션까지 직접 연결.</p>
     <p className="mobile-role-summary">MY CONTRIBUTION / {project.responsibilities[0]}</p>
     <MobileDisclosure title="MY CONTRIBUTION / 협업·수행 범위 상세"><div className="f-contribution"><h2>MY CONTRIBUTION</h2><ul>{project.responsibilities.map(text=><li key={text}>{text}</li>)}</ul></div></MobileDisclosure>
     <div className="f-result"><h2>RESULT / SCOPE</h2><p>{project.result}</p><p>{project.resultDetail}</p></div>
    </div>
    {gallery}
   </div>
  </section>
  <section className="leadership-functions" aria-labelledby="across-functions">
   <div className="leadership-functions-intro">
    <div>
     <header className="leadership-section-heading"><span className="f-kicker">02 / ACROSS FUNCTIONS</span><h2 id="across-functions">부서 간 협업</h2><p>협업 부서 간 입체적 병렬 구조 전략</p></header>
     <p className="leadership-transition">기존 제품에서 리뉴얼 제품으로,<br/>매출 연속성과 성장 기회를 고려한 전환 전략</p>
    </div>
    <img className="leadership-functions-image" src="/portfolio/revision-v5/leadership-bellast.png" alt="벨라스트 6종 리뉴얼 패키지" loading="lazy"/>
   </div>
   {project.caseStudy&&<ProjectCaseStudy study={project.caseStudy}/>}
  </section>
  {!embedded&&<nav className="f-project-bottom" aria-label="리더십 탐색"><a href="/process/leadership">Leadership overview</a><a href="/project/yuriyuri">YURI&YURI archive</a></nav>}
 </section>
}
