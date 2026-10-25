import {chapters} from '../app/portfolio-data';

export const siteOrigin='https://yurichoi.com';
const projects=chapters.flatMap(c=>c.projects);
const topics:Record<string,string>={approach:'About & Approach',thinking:'Thinking System',decision:'Decision Log',cases:'Selected Business Cases',strategy:'Designing for Growth',profit:'Portfolio & Profitability Management','digital-growth':'Digital Marketing & Growth',systems:'Business Systems',leadership:'Cross-functional Leadership',global:'Global Execution','ai-leadership':'AI Agent Leadership','ai-workflow':'AI Agent Leadership — Workflow'};
export const routeAliases:Record<string,string>={home:'home',resume:'home',portfolio:'work',business:'process',leadership:'project/leadership',profitability:'project/profitability','business-strategy':'project/business-strategy','process/principles':'process/approach','process/decisions':'process/decision','process/decision-log':'process/decision'};
export type PublicRoute={route:string;path:string;title:string;description:string;image:string};
const defaultImage='/cover-final/portrait-tall.png';
const item=(route:string,title:string,description:string,image=defaultImage):PublicRoute=>({route,path:route==='home'?'/':'/'+route,title,description,image});
export const publicRoutes:PublicRoute[]=[
 item('home','Yuri Choi — Product & Brand Business Leader','최유리의 브랜드·비즈니스 포트폴리오. Beauty · Medical Beauty · Fashion, 제품과 손익의 의사결정부터 글로벌 실행까지.'),
 item('work','Work — Yuri Choi','제품·성장·수익성·브랜드 운영의 대표 사례와 분야별 프로젝트 아카이브.'),
 ...Object.entries({beauty:'Beauty',medical:'Medical Beauty',fashion:'Fashion'}).map(([key,title])=>item('work/'+key,title+' — Work — Yuri Choi',title+' 분야의 제품·브랜드·사업 운영 프로젝트.')),
 ...['beauty/dongkook','beauty/hugel','medical/dongkook','medical/hugel','medical/events'].map(key=>item('work/'+key,key.split('/')[1].toUpperCase()+' — Work archive — Yuri Choi','회사별 제품·브랜드 프로젝트 아카이브.')),
 item('process','Work Process — Yuri Choi','시장·고객·원가 분석부터 제품·브랜드·사업의 판단과 실행까지.'),
 ...Object.entries(topics).map(([key,title])=>item('process/'+key,title+' — Work Process — Yuri Choi',title+' — 제품·브랜드·사업의 판단 기준과 실행 사례.')),
 item('press','Media & Press — Yuri Choi','인터뷰 · 브랜드 보도 · 에디토리얼.'),
 item('cv','GET MY CV — Yuri Choi','공개 경력과 성과 요약. CV PDF는 비밀번호로 보호됩니다.'),
 item('cv/summary','Career at a Glance — Yuri Choi','동국제약 · YURI&YURI · 휴젤의 담당 역할과 주요 성과.'),
 ...projects.map(p=>item('project/'+p.id,p.title.replace(/\n/g,' ')+' — Yuri Choi',p.description,p.images[0]||defaultImage)),
 ...['dkma','chaeum','madeca-md','madeca-labs','yuriyuri'].flatMap(id=>{
  const p=projects.find(p=>p.id===id)!;
  return [item('case/'+id,p.title.replace(/\n/g,' ')+' — Case Study — Yuri Choi',p.description,p.images[0]||defaultImage)];
 }),
];
export function findPublicRoute(input:string){
 const clean=input.replace(/^\/+|\/+$/g,'')||'home';
 const route=routeAliases[clean]||clean;
 const base=/^case\/[^/]+\/details$/.test(route)?route.slice(0,-8):route;
 const found=publicRoutes.find(r=>r.route===base);
 return found?{...found,route}:undefined;
}
export function routeHref(input:string){const route=findPublicRoute(input);return route?route.path+(route.route.endsWith('/details')?'#case-details':''):undefined;}
export function pageMetadata(route:PublicRoute){
 const url=siteOrigin+route.path,image=new URL(route.image,siteOrigin).href;
 return {title:route.title,description:route.description,alternates:{canonical:url},openGraph:{type:'website' as const,title:route.title,description:route.description,url,siteName:'Yuri Choi',images:[image]},twitter:{card:'summary_large_image' as const,title:route.title,description:route.description,images:[image]}};
}
