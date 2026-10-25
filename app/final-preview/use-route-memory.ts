import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {findPublicRoute, routeHref, siteOrigin} from '../../lib/portfolio-routes';

type ViewState={scroll:number;details:boolean[];focusIndex:number};
export function useRouteMemory(initialRoute='home'){
 const [route,setRoute]=useState(initialRoute);
 const current=useRef<string|null>(null);
 const views=useRef(new Map<string,ViewState>());
 const pending=useRef<ViewState|undefined>(undefined);
 useEffect(()=>{
  const oldRestoration=history.scrollRestoration;
  history.scrollRestoration='manual';
  const sync=()=>{
   let hash='';try{hash=decodeURIComponent(location.hash.slice(1))}catch{}
   const legacy=hash?findPublicRoute(hash):undefined;
   const page=legacy||findPublicRoute(location.pathname)||findPublicRoute(initialRoute)!;
   if(legacy){const url=new URL(routeHref(hash)!,location.origin);url.search=location.search;history.replaceState(history.state,'',url.pathname+url.search+url.hash);}
   const next=page.route;
   document.title=page.title;
   const canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
   if(canonical)canonical.href=siteOrigin+page.path;
   for(const [key,value] of Object.entries({'og:title':page.title,'og:description':page.description,'og:url':siteOrigin+page.path,'og:image':new URL(page.image,siteOrigin).href}))document.querySelector<HTMLMetaElement>(`meta[property="${key}"]`)?.setAttribute('content',value);
   document.querySelector('meta[name="description"]')?.setAttribute('content',page.description);
   if(next===current.current)return;
   if(current.current){
    const active=document.activeElement;
    views.current.set(current.current,{scroll:window.scrollY,details:Array.from(document.querySelectorAll<HTMLDetailsElement>('.f-main details')).map(d=>d.open),focusIndex:Array.from(document.querySelectorAll('.f-main a')).indexOf(active as Element)});
   }
   pending.current=next==='home'?undefined:views.current.get(next);
   current.current=next;
   setRoute(next);
  };
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const a=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
   if(!a||a.target||a.hasAttribute('download'))return;
   const url=new URL(a.href,location.href);
   if(url.origin!==location.origin||!findPublicRoute(url.pathname)||url.hash||url.search)return;
   event.preventDefault();
   history.pushState(null,'',url.pathname);sync();
   window.dispatchEvent(new Event('yc:navigation'));
  };
  sync();window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);document.addEventListener('click',click);
  return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);document.removeEventListener('click',click);history.scrollRestoration=oldRestoration};
 },[initialRoute]);
 useLayoutEffect(()=>{
  const saved=pending.current;
  const careerStart=route==='cv/summary';
  let cancelled=false;
  const scrollToCareer=()=>{
   if(cancelled)return;
   const heading=document.getElementById('career-heading');
   if(heading)window.scrollTo({top:Math.max(0,window.scrollY+heading.getBoundingClientRect().top-24),behavior:'instant'});
  };
  const main=document.querySelector<HTMLElement>('.f-main');
  if(saved)main?.querySelectorAll<HTMLDetailsElement>('details').forEach((d,i)=>{d.open=saved.details[i]??false});
  main?.focus({preventScroll:true});
  window.scrollTo({top:saved?.scroll??0,behavior:'instant'});
  let second=0;
  const frame=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>{
   if(careerStart){
    scrollToCareer();
    // Font loading can change the height of the CV introduction above the heading.
    void document.fonts.ready.then(scrollToCareer);
   }else if(saved){
    const link=main?.querySelectorAll<HTMLAnchorElement>('a')[saved.focusIndex];
    link?.focus({preventScroll:true});
    window.scrollTo({top:saved.scroll,behavior:'instant'});
   }else if(route.endsWith('/details')||location.hash==='#case-details')document.getElementById('case-details')?.scrollIntoView({block:'start'});
   else {
    const archiveRoute=route.match(/^work\/(medical|beauty)\/(dongkook|hugel|events)$/);
    if(archiveRoute){
     const group=document.getElementById(`archive-${archiveRoute[1]}-${archiveRoute[2]}`) as HTMLDetailsElement|null;
     if(group){group.open=true;group.scrollIntoView({block:'start'});group.querySelector('summary')?.focus({preventScroll:true});}
    }
   }
  })});
  return()=>{cancelled=true;cancelAnimationFrame(frame);cancelAnimationFrame(second)};
 },[route]);
 return route;
}
