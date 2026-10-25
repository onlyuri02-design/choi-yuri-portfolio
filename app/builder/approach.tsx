import { framework, principles, thinking, decisions, systems } from "./content";
export function Approach(){return <section className="approach-archive" aria-label="업무 방식과 경력 배경">
<details id="about"><summary><span>ABOUT &amp; APPROACH</span><span>업무 방식과 경력 배경 +</span></summary><div className="approach-intro"><img src="/think-first-lightbulbs.jpg" alt="다양한 색상의 전구" loading="lazy"/><div><h2>THINK FIRST.<br/>BUILD THROUGH.</h2><p>제품의 기획과 출시, 브랜드 운영, 손익 관리, 글로벌 유통. 서울과 런던에서 쌓은 경험의 공통점은 기획 이후의 일까지 직접 맡았다는 것.</p></div></div>
<details id="philosophy"><summary>HOW I THINK <span>+</span></summary><div className="approach-body"><p className="approach-flow">{framework.join(" → ")}</p>{principles.map(([n,t,d])=><article key={n}><h3>{t}</h3><p>{d}</p></article>)}</div></details>
<details id="thinking"><summary>THINKING SYSTEM <span>+</span></summary><div className="approach-body">{thinking.map(([t,d,tag])=><article key={t}><h3>{t}</h3><p>{d}</p><small>{tag}</small></article>)}</div></details>
<details id="decisions"><summary>DECISION LOG <span>+</span></summary><div className="approach-body">{decisions.map(([n,t,d,tag,url])=><article key={n}><h3>{t}</h3><p>{d}</p><a href={url}>{tag} / 관련 프로젝트 ↗</a></article>)}</div></details>
<details id="cases"><summary>SELECTED CASES <span>+</span></summary><div className="approach-body"><a href="#portfolio">대표 프로젝트 3개 보기 ↗</a></div></details>
<details id="systems"><summary>BUSINESS SYSTEMS <span>+</span></summary><div className="approach-body">{systems.map(([n,t,d])=><article key={n}><h3>{t}</h3><p>{d}</p></article>)}</div></details>
</details></section>}
