import type { Project } from '../portfolio-data';
import './project-case-study.css';
import {MobileDisclosure} from './mobile-disclosure';

export function ProjectCaseStudy({study}:{study:NonNullable<Project['caseStudy']>}){
 return <section className="f-case-study" aria-label={study.title}>
  <span className="f-kicker">{study.kicker}</span>
  <h2>{study.title}</h2>
  <ol>{study.steps.map(step=><li key={step.title}><MobileDisclosure enabled={!step.title.includes('결과')} title={step.title}><h3>{step.title}</h3><p>{step.text}</p></MobileDisclosure></li>)}</ol>
 </section>;
}
