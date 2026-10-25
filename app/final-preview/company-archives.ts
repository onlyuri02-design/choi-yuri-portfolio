export type ArchiveGroup = {id?:string;title:string;description:string;ids:string[]};

export const companyArchives:Record<string,ArchiveGroup[]> = {
 medical:[
  {id:'dongkook',title:'동국제약 · DONGKOOK PHARMACEUTICAL',description:'포트폴리오 운영 · 제품·브랜드 아카이브',ids:['dkma','bellast','kablelyn','bienox','millifit','fillroad','inable','dehyve','madekiel','inhilo']},
  {id:'hugel',title:'휴젤 · HUGEL',description:'제품·브랜드 성장 아카이브',ids:['chaeum','botulax','blue-rose']},
 ],
 beauty:[
  {id:'dongkook',title:'동국제약 · DONGKOOK PHARMACEUTICAL',description:'제품 기획·개발 · 출시·운영',ids:['madeca-md','madeca-labs']},
  {id:'hugel',title:'휴젤 · HUGEL',description:'브랜드·제품 개발',ids:['wellage']},
 ],
};

export function companyArchiveFor(projectId:string){
 for(const [category,groups] of Object.entries(companyArchives)){
  const group=groups.find(g=>g.ids.includes(projectId));
  if(group)return {category,group,href:`/work/${category}/${group.id}`};
 }
 return null;
}
