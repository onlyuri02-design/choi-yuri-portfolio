"use client";
import { useEffect, useRef, useState } from 'react';
import { chapters, portfolioChapters, type Project } from '../portfolio-data';
import { press } from '../press-data';
import WorkProcess from './work-process';
import AIWorkflow from './ai-workflow';
import { BusinessCase } from './business-cases';
import { ModelStory } from './model-story';
import { useRouteMemory } from './use-route-memory';
import { ProjectCaseStudy } from './project-case-study';
import YuriYuriCase from './yuriyuri-case';
import HomeProof from './home-proof';
import {CompanyCI} from './company-ci';
import CV from './cv-page';
import { companyArchives, companyArchiveFor, type ArchiveGroup } from './company-archives';
import { LeadershipOwnership, BusinessDecisions, CostProposal } from './ownership';
import LeadershipArchive from './leadership-archive';
import {MobileDisclosure} from './mobile-disclosure';

const work = portfolioChapters;
const allProjects = chapters.flatMap(c=>c.projects);
const business = chapters.find(c=>c.id==='business')!;
const workImages: Record<string,string> = {beauty:'/cover-final/work-beauty-v3.png',medical:'/cover-final/work-medical-v3.png',fashion:'/cover-final/work-fashion-v3.jpg'};
const expertiseLinks=['/process/systems','/case/madeca-labs','/case/chaeum','/case/dkma','/work/fashion','/project/leadership'];
const names: Record<string,string> = {beauty:'Beauty',medical:'Medical Beauty',fashion:'Fashion',business:'Work Process',summary:'Career at a Glance'};
const expertise = [
 ['Brand & Business','Brand Strategy','Brand Positioning','New Business Development','0→1 Brand Building','Growth Strategy'],
 ['Product & Portfolio','Product Development','Portfolio Strategy','Product Launch','Pricing & Profitability','Lifecycle Management'],
 ['Consumer & Marketing','Consumer/HCP/KOL Marketing','Digital & Social','Campaigns & Content','CRM: Lead Generation→Nurturing','Retail & Channel Strategy'],
 ['Business & Growth','P&L Management','Sales & Forecasting','ROI · BEP','Budget Management','Business Performance'],
 ['Fashion & Commerce','Brand Direction','DTC E-commerce','Wholesale','Retail Experience','Global Distribution'],
 ['Leadership & Global','AI Agent Leadership ↗','Team Leadership','Cross-functional Management','Global Business','Buyer & Partner Network'],
];
const fashionGroups = [
 {title:'Brand Story',description:'브랜드의 시작과 테일러링',ids:['yuriyuri','master-tailoring']},
 {title:'Retail & Distribution',description:'Online · Offline · Showroom',ids:['global-retail','offline-retail','showroom-london','showroom-paris']},
 {title:'Clients',description:'Our Heroes · Celebrity & Editorial',ids:['vip-clients','celebrity-editorial']},
 {title:'Collection',description:'컬렉션 기획·디자인·패턴·소재 선정·생산·룩북 비주얼 디렉션',ids:['aw19','ss19','aw20','aw21','aw23','ss23','resort','lounge']},
];
function Num({text}:{text:string}){return <>{text.split(/(\d+(?:[.,]\d+)*(?:%|\+)?)/g).map((s,i)=>i%2?<b key={i}>{s}</b>:s)}</>}
function Contact(){
 const [open,setOpen]=useState<'phone'|'email'|null>(null);const [copied,setCopied]=useState(false);
 const value=open==='phone'?'010-8919-8391':'onlyuri02@gmail.com';
 return <div className="f-contact">
 {open&&<div className="f-contact-pop" role="region" aria-label={open==='phone'?'전화번호':'이메일 주소'}><button className="f-close" onClick={()=>setOpen(null)} aria-label="연락처 닫기">×</button><small>{open==='phone'?'PHONE':'EMAIL'}</small><a href={(open==='phone'?'tel:':'mailto:')+value}>{value}</a><button onClick={async()=>{try{await navigator.clipboard.writeText(value);setCopied(true)}catch{setCopied(false)}}}>{copied?'복사됨':'복사하기'}</button></div>}
 <button aria-label="전화번호 보기" aria-expanded={open==='phone'} onClick={()=>{setOpen(open==='phone'?null:'phone');setCopied(false)}}><img src="/cover-final/phone.png" alt=""/></button>
 <button aria-label="이메일 주소 보기" aria-expanded={open==='email'} onClick={()=>{setOpen(open==='email'?null:'email');setCopied(false)}}><img src="/cover-final/email.png" alt=""/></button>
 <a href="https://www.instagram.com/onlyuridoes/" target="_blank" rel="noreferrer" aria-label="인스타그램 onlyuridoes (새 탭)"><img src="/cover-final/instagram.png" alt=""/></a>
 </div>
}
function Cover(){return <>
 <section className="f-cover" aria-label="Yuri Choi 소개">
  <div className="f-portrait">
   <img className="portrait-photo" src="/portfolio/yuri-terrace-navy-pinstripe.png" alt="런던 테라스에서 노트북과 함께 있는 Yuri Choi" fetchPriority="high"/>
   <a className="glance-ribbon" href="/cv/summary" aria-label="Career at a Glance — 경력·성과 한눈에 보기">
    <span className="glance-track" aria-hidden="true"><span>Career at a Glance ↗</span><span>Career at a Glance ↗</span></span>
   </a>
  </div>
  <div className="f-cover-copy">
   <nav className="f-cover-menu" aria-label="주요 메뉴">
    <div><a href="/work">Work↗</a><div className="f-category-strip"><a href="/work/beauty">Beauty</a><span> · </span><a href="/work/medical">Medical Beauty</a><span> · </span><a href="/work/fashion">Fashion</a></div></div>
    <a href="/process">Work Process↗</a><a href="/process/ai-workflow">AI Agent Leadership↗</a><a href="/press">Media &amp; Press↗</a><a className="f-notes-link" href="/notes">Notes</a><a href="/cv">GET MY CV↗</a>
   </nav>
   <h1><span className="f-cover-line"><strong>Hello, I’m Yuri.</strong></span><span className="f-cover-line"><mark>Brand &amp; Business</mark></span><span className="f-cover-line"><mark>Builder</mark></span></h1>
   <p className="f-cover-positioning"><span>Building brands across</span><strong>Beauty, Fashion &amp; Lifestyle —</strong><strong>from product to business.</strong></p>
   <p className="f-cover-support"><span>Product strategy, brand building, growth and P&amp;L —</span><span>shaped by experience across medical beauty and London fashion.</span></p>
   <HomeProof/>
  </div>
  <Contact/>
 </section>
 <footer className="f-cover-footer"><div className="f-name-bar"><span>YURI CHOI</span><small>© 2026 YURI CHOI — Designed &amp; Built</small></div><div className="f-expertise">{expertise.map((items,i)=><section key={items[0]}><a href={expertiseLinks[i]}><h2>{items[0]}</h2></a>{items.slice(1).map(item=><p key={item}>{item.startsWith('AI Agent Leadership')?<a href="/process/ai-workflow">{item}</a>:item}</p>)}</section>)}</div></footer>
 </>}
function PageHeading({kicker,title,description,brand}:{kicker:string;title:string;description?:string;brand?:string}){
 if(brand)return <div className="f-page-heading r-fashion-heading"><div className="r-fashion-copy"><span className="f-kicker">{kicker}</span><h1>{title}</h1><h2 className="r-fashion-brand">{brand}</h2>{description&&<p>{description}</p>}</div><img className="r-fashion-sign" src="/cover-final/yuriyuri-sign.png" alt="YURI&YURI 브랜드 간판" width={1448} height={1086}/></div>;
 return <div className="f-page-heading"><span className="f-kicker">{kicker}</span><h1>{title}</h1>{description&&<p>{description}</p>}</div>;
}
function ProjectLink({p,index}:{p:Project;index:number}){return <a className="f-project-row" href={'/project/'+p.id}><span className="f-row-number">{String(index+1).padStart(2,'0')}</span><span><strong>{p.title.replace(/\n/g,' ')}</strong><small>{p.id==='dkma'?'Portfolio Overview / '+p.subtitle:p.subtitle}</small></span><span className="f-row-arrow">↗</span></a>}
const categoryRoles:Record<string,string[]> = {
 beauty:['PRODUCT DEVELOPMENT','제품 기획 · OEM 협업 · 출시·운영'],
 medical:['PORTFOLIO & P&L','포트폴리오 운영 · 제품 차별화 · 수익성'],
 fashion:['BRAND & GLOBAL BUSINESS','브랜드 창업 · 컬렉션 · 글로벌 유통'],
};
const featuredCases=[
 {id:'dkma',href:'/case/dkma',name:'DKMA',label:'PROFITABILITY',title:'26 SKU 포트폴리오의 수익성 기반 구성 기획 · 투자 판단',proof:'2023–2025 CAGR 64.7%',images:['dkma-launch.webp'],alt:'DKMA Launch Symposium 현장'},
 {id:'yuriyuri',href:'/case/yuriyuri',name:'YURI&YURI',label:'BRAND & COMMERCE',title:'런던 독립 남성복 브랜드의 기획 · 제품 · 커머스 직접 운영',proof:'FOUNDER-LED · 10+개국 판매·유통 접점',images:['yuriyuri-selected-tailoring.png'],alt:'브라운 재킷을 착용한 YURI&YURI 테일러링 이미지'},
 {id:'chaeum',href:'/case/chaeum',name:'THE CHAEUM',label:'GROWTH',title:'제품·브랜드 차별화와 매출 성장',proof:'2014–2017 매출 CAGR 약 48.1%',images:['chaeum-editorial-spread.png'],alt:'더채움 모델 주상욱 THE STAR 에디토리얼'},
 {id:'madeca-md',href:'/case/madeca-md',name:'MADECA MD',label:'PRODUCT',title:'제품 기획부터 출시·운영, 성상 개선까지',proof:'5종 · E2E OWNERSHIP',images:['madeca-md-color.png'],alt:'MADECA MD 모녀 브랜드 이미지'},
];
function WorkIndex({category,archiveGroup}:{category?:string;archiveGroup?:string}){
 const chapter=work.find(c=>c.id===category);
 if(!chapter)return <section className="f-content v-work"><PageHeading kicker="PORTFOLIO" title="Work" description="Product · Growth · Business"/>
<section className="v-featured" aria-labelledby="featured-title"><header><h2 id="featured-title">Selected Cases</h2><p>제품 · 성장 · 수익성 · 브랜드 운영의 대표 사례</p></header><div className="v-featured-grid v-featured-final">{featuredCases.map((c,i)=><a href={c.href} key={c.id}><span className="f-kicker">0{i+1} / {c.label}</span><div className={'v-case-heading v-case-heading-'+c.id}><h3>{c.name}{(c.id==='dkma'||c.id==='madeca-md')&&<CompanyCI company="dongkook"/>} {c.id==='chaeum'&&<CompanyCI company="hugel"/>}</h3>{c.id!=='chaeum'&&c.id!=='madeca-md'&&<span aria-hidden="true">↗</span>}</div><div className={'v-featured-photo v-photo-'+c.id}>{c.images.map((src,j)=><img src={'/portfolio/september-update/'+src} alt={j===0?c.alt:''} key={src} loading="lazy"/>)}</div><p>{c.title}</p><strong>{c.proof}</strong><span className="v-case-link">Case details ↗</span></a>)}</div></section>
  <header className="v-section-heading"><h2>By Field</h2><p>분야별 프로젝트 아카이브</p></header>
  <div className="f-fields">{work.map((c,i)=><a href={'/work/'+c.id} key={c.id}><span className="f-kicker">0{i+1} / {categoryRoles[c.id][0]}</span><h2>{names[c.id]} <span>↗</span></h2><div className="r-work-image"><img src={workImages[c.id]} alt={names[c.id]+' 포트폴리오'} loading="lazy"/></div><p>{categoryRoles[c.id][1]}</p><span className="r-blue-link">{names[c.id]} archive ↗</span></a>)}</div></section>;
 const groups:ArchiveGroup[]|null=chapter.id==='fashion'?fashionGroups:chapter.id==='medical'?[...companyArchives.medical,{id:'events',title:'Events & Symposia',description:'론칭·학술 커뮤니케이션',ids:chapters.find(c=>c.id==='events')!.projects.filter(p=>p.id!=='dkma-symposium').map(p=>p.id)}]:companyArchives[chapter.id]||null;
 return <section className="f-content r-category"><div className="r-category-heading"><span className="f-kicker">WORK / {names[chapter.id]}</span><nav aria-label="Work 카테고리">{work.map(c=><a href={'/work/'+c.id} key={c.id} aria-current={c.id===category?'page':undefined}>{names[c.id]}</a>)}</nav></div><PageHeading kicker={categoryRoles[chapter.id][0]} title={names[chapter.id]} description={categoryRoles[chapter.id][1]} brand={chapter.id==='fashion'?'YURI&YURI':undefined}/><div className="r-category-archive r-category-list"><p className="r-index-instruction">프로젝트별 담당 역할 · 판단 · 작업 아카이브</p><div className="f-project-index">{groups?groups.map(g=><details className="f-project-group" key={g.title} id={g.id?`archive-${chapter.id}-${g.id}`:undefined} open={g.id?g.id===archiveGroup:undefined}><summary><span>{g.title}<small>{g.description}</small></span><span className="f-plus">+</span></summary>{g.ids.map((id,i)=><ProjectLink key={id} p={allProjects.find(p=>p.id===id)!} index={i}/>)}</details>):chapter.projects.map((p,i)=><ProjectLink key={p.id} p={p} index={i}/>)}</div></div></section>
}
function ProductImprovement(){return <section className="v-improvement" aria-labelledby="improvement-title"><span className="f-kicker">PRODUCT IMPROVEMENT</span><h2 id="improvement-title">Appearance Stability</h2><p className="v-improvement-deck">성상 분리 이슈 대응 · 성상 유지 온도 범위 확대</p><ol>{[
 ['ISSUE','성상 분리 이슈 확인'],
 ['RESEARCH','연구소에 온도별 보관 조건에 따른 성상 변화 검토 요청'],
 ['DECISION','성상 유지 온도 범위 확대를 위한 개선 방향 설정'],
 ['CHANGE','설정 방향에 따른 제품 성상 변경'],
 ].map(([title,text],i)=><li key={title}><b>0{i+1}</b><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>}
function ProjectGallery({project}:{project:Project}){
 const [selected,setSelected]=useState(0);
 const touchStart=useRef<number|null>(null);
 const rolling=project.id==='profitability';
 const change=(delta:number)=>setSelected(current=>(current+delta+project.images.length)%project.images.length);
 if(!project.images.length)return <p className="f-note">준비 중인 프로젝트 이미지</p>;
 return <div className={'f-gallery'+(rolling?' v-pnl-gallery':'')+(project.id==='business-strategy'?' v-strategy-monochrome':'')} role={rolling?'region':undefined} aria-label={rolling?'P&L 의사결정 도표':undefined} aria-roledescription={rolling?'carousel':undefined}>
 {rolling&&<div className="v-gallery-heading"><span className="f-kicker">COMMERCIAL DECISION FRAMEWORK</span><p>같은 판단 체계의 두 가지 보기 · 좌우로 넘김</p></div>}
 <figure onTouchStart={e=>{touchStart.current=e.touches[0].clientX}} onTouchEnd={e=>{if(rolling&&touchStart.current!==null){const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>50)change(delta<0?1:-1)}touchStart.current=null}}>
 <a href={project.images[selected]} target="_blank" rel="noreferrer" aria-label="선택한 이미지 크게 보기 (새 탭)"><img src={project.images[selected]} alt={project.imageCaptions?.[selected]||project.title.replace(/\n/g,' ')+' 프로젝트 이미지'} /></a>
 <figcaption aria-live="polite"><span>{project.imageCaptions?.[selected]||project.subtitle}</span><b>{selected+1} / {project.images.length}</b></figcaption></figure>
 {rolling&&<div className="v-gallery-controls"><button onClick={()=>change(-1)} aria-label="이전 도표">← Previous</button><span>{String(selected+1).padStart(2,'0')} / 02</span><button onClick={()=>change(1)} aria-label="다음 도표">Next →</button></div>}
 {project.images.length>1&&<div className="f-thumbnails">{project.images.map((src,i)=><button key={src} aria-label={rolling?`${i+1}번 도표: ${project.imageCaptions?.[i]}`:`${i+1}번 이미지 보기`} aria-pressed={i===selected} onClick={()=>setSelected(i)}><img src={src} alt="" loading="lazy"/></button>)}</div>}
 </div>
}
function ProjectPage({id,embedded=false}:{id:string;embedded?:boolean}){
 if(id==='leadership'){const project=allProjects.find(p=>p.id===id)!;return <LeadershipArchive project={project} gallery={<ProjectGallery key={id} project={project}/>} embedded={embedded}/>;}
 const p=allProjects.find(p=>p.id===id);if(!p)return <section className="f-content"><PageHeading kicker="PROJECT" title="Project not found"/><a href="/work">Work로 돌아가기 ↗</a></section>;
 const collections=fashionGroups.find(g=>g.title==='Collection')!.ids;
 if(collections.includes(id))return <section className="f-content f-project revision-collection"><PageHeading kicker="YURI&YURI / COLLECTION" title={p.title} description={p.subtitle}/><ProjectGallery key={id} project={p}/><nav className="f-project-bottom" aria-label="다음 컬렉션"><a href="/work/fashion">← Collection index</a><a href={'/project/'+collections[(collections.indexOf(id)+1)%collections.length]}>Next collection →</a></nav></section>;
 const chapter=work.find(c=>c.projects.some(x=>x.id===id))||business;const companyArchive=companyArchiveFor(id);const siblings=companyArchive?companyArchive.group.ids.map(projectId=>allProjects.find(p=>p.id===projectId)!):chapter.projects;const next=siblings[(siblings.findIndex(x=>x.id===id)+1)%siblings.length];
 return <section className={(embedded?"f-project r-featured-project":"f-content f-project")+(id==="business-strategy"?" f-business-ownership":"")}><div className="f-project-intro"><div className="f-kicker">{p.organization} <span> / {p.period}</span></div><h1>{p.title.replace(/\n/g,' ')}</h1><p className="f-project-subtitle">{p.subtitle}</p>{['chaeum','dkma','madeca-md','madeca-labs'].includes(id)&&<a className="r-blue-link r-case-entry" href={'/case/'+id}>Problem → Decision → Impact <span>Read business case ↗</span></a>}</div><div className="f-case-layout"><div className="f-case-copy"><p className="f-description"><Num text={p.description}/></p>{id==='madeca-md'&&<ProductImprovement/>}{id==='leadership'&&<LeadershipOwnership/>}{id==='profitability'&&<MobileDisclosure title="판단 기준과 추가 개선안"><BusinessDecisions/><CostProposal/></MobileDisclosure>}{p.caseStudy&&<ProjectCaseStudy study={p.caseStudy}/>}{id==='profitability'&&<p className="mobile-role-summary">MY CONTRIBUTION / 원가구조·공헌이익 분석과 패키지 개선 실행</p>}<MobileDisclosure enabled={id==='profitability'} title="MY CONTRIBUTION / 수행 범위 상세"><div className="f-contribution"><h2>{p.contributionLabel||"MY CONTRIBUTION"}</h2><ul>{p.responsibilities.map((r,i)=><li key={r}>{p.responsibilityTitles?.[i]&&<strong>{p.responsibilityTitles[i]}</strong>}<span><Num text={r}/></span></li>)}</ul></div></MobileDisclosure>{p.result&&<div className="f-result"><h2>{id==='madeca-md'?'SCOPE / OWNERSHIP':'RESULT / SCOPE'}</h2><p><Num text={p.result}/></p>{p.resultDetail&&<p className="f-result-detail">{p.resultDetail}</p>}</div>}{(id==='wellage'||id==='chaeum')&&<ModelStory/>}{p.note&&<p className="f-note">{p.note}</p>}</div><ProjectGallery key={id} project={p}/></div>{!embedded&&<nav className="f-project-bottom" aria-label="다음 탐색"><a href={companyArchive?.href||(chapter.id==='business'?'/process':'/work/'+chapter.id)}>← {companyArchive?companyArchive.group.title:names[chapter.id]} index</a><a href={next.id===id?'/work/'+chapter.id:'/project/'+next.id}>{next.id===id?names[chapter.id]+' index':'Next / '+next.title.replace(/\n/g,' ')} ↗</a></nav>}</section>
}
function Press(){return <section className="f-content v-press"><PageHeading kicker="IN THE MEDIA" title="Media & Press" description="인터뷰 · 브랜드 보도 · 에디토리얼"/><img className="v-press-banner" src="/portfolio/september-update/media-press-banner-lime.png" alt="Media & Press — Yuri Choi, 인터뷰·브랜드 보도·에디토리얼" width={1881} height={836}/>{['Beauty','Medical Beauty','Fashion'].filter(category=>press.some(p=>p.category===category)).map(category=><details className="f-project-group" key={category}><summary><b>{category}</b><span className="f-plus">+</span></summary>{['Interview','Brand Coverage','Editorial'].filter(type=>press.some(p=>p.category===category&&p.type===type)).map(type=><section className="v-press-type" key={type}><header><h2>{type}</h2><p>{{Interview:'본인 인터뷰', 'Brand Coverage':'브랜드·제품 관련 보도',Editorial:'제품·스타일 에디토리얼'}[type]}</p></header><div className="f-press-grid">{press.filter(p=>p.category===category&&p.type===type).map(p=><article key={p.id}><a href={p.url} target="_blank" rel="noreferrer"><img src={p.image} alt={p.relatedImage?'관련 프로젝트 이미지':p.title} loading="lazy" onError={e=>{if(e.currentTarget.getAttribute('src')!==p.fallback)e.currentTarget.src=p.fallback}}/><small>{p.publisher} / {p.date}</small><h3>{p.title} ↗</h3></a><p>{p.summary}</p></article>)}</div></section>)}</details>)}</section>}
export default function FinalPortfolio({initialRoute='home'}:{initialRoute?:string}){
 const route=useRouteMemory(initialRoute);
 const [kind,id,archiveGroup]=route.split('/');const isYuriCase=kind==='case'&&id==='yuriyuri';const project=(kind==='project'||kind==='case')?allProjects.find(p=>p.id===id):null;const category=project?work.find(c=>c.projects.some(p=>p.id===id))?.id:null;
 return <div className={'final-site'+(route==='home'?' v-home':' v-interior')}>
 <a className="f-skip" href="#main-content" onClick={e=>{e.preventDefault();document.querySelector<HTMLElement>('.f-main')?.focus()}}>본문으로 이동</a>
 {route!=='home'&&<header className="f-header"><a className="f-brand" href="/">YURI CHOI</a><nav aria-label="주요 메뉴"><a href="/work" aria-current={kind==='work'||isYuriCase||(kind==='project'&&category)?'page':undefined}>Work</a><a href="/process" aria-current={(kind==='process'&&id!=='ai-workflow')||(kind==='case'&&!isYuriCase)||(kind==='project'&&!category)?'page':undefined}>Work Process</a><a href="/process/ai-workflow" aria-current={kind==='process'&&id==='ai-workflow'?'page':undefined}>AI Agent Leadership</a><a href="/press" aria-current={kind==='press'?'page':undefined}>Media &amp; Press</a><a className="f-notes-link" href="/notes">Notes</a><a href="/cv" aria-current={kind==='cv'?'page':undefined}>GET MY CV</a></nav></header>}
 {route!=='home'&&<nav className="f-breadcrumb" aria-label="현재 위치"><a href="/">Home</a><span>/</span>{kind==='process'&&id==='ai-workflow'?<><a href="/process">Work Process</a><span>/</span><span>AI Agent Leadership</span></>:isYuriCase?<><a href="/work">Work</a><span>/</span><a href="/work">Selected Cases</a><span>/</span><span>YURI&amp;YURI</span></>:kind==='case'?<><a href="/process">Work Process</a><span>/</span><a href="/process/cases">Selected Business Cases</a><span>/</span><span>{project?.title.replace(/\n/g,' ')||'Business Case'}</span></>:kind==='project'?<><a href={category?'/work':'/process'}>{category?'Work':'Work Process'}</a>{category&&<><span>/</span><a href={'/work/'+category}>{names[category]}</a></>}<span>/</span><span>{project?.title.replace(/\n/g,' ')||'Project'}</span></>:<><a href={'/'+kind}>{kind==='work'?'Work':kind==='process'?'Work Process':kind==='press'?'Media & Press':'GET MY CV'}</a>{id&&<><span>/</span><span>{kind==='process'?({'digital-growth':'Digital Marketing & Growth','ai-leadership':'AI Agent Leadership',principles:'How I Think',approach:'About & Approach',thinking:'Thinking System',decisions:'Decisions in Practice',leadership:'Cross-functional Leadership',systems:'Business Systems',cases:'Selected Business Cases'} as Record<string,string>)[id]||id:names[id]||id}</span></>}</>}</nav>}
 <main key={route} className="f-main" id="main-content" tabIndex={-1}>{route==='home'?<Cover/>:kind==='work'?<WorkIndex category={id} archiveGroup={archiveGroup}/>:kind==='project'?<ProjectPage id={id}/>:kind==='case'?(isYuriCase?<YuriYuriCase/>:<BusinessCase id={id}/>):kind==='process'?(id==='ai-workflow'?<AIWorkflow/>:<WorkProcess section={id}/>):kind==='press'?<Press/>:kind==='cv'?<CV/>:<Cover/>}</main>
 {route!=='home'&&<footer className="f-inner-footer"><a className="f-brand" href="/">YURI CHOI</a><span>© 2026 YURI CHOI — Designed &amp; Built</span><Contact/></footer>}
 </div>
}
