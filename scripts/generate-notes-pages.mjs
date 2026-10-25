// Render only trusted in-repository Notes content at build time; VM is not shipped.
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {parseHTML} from 'linkedom';
const root=resolve(import.meta.dirname,'..');
async function moduleURL(file){
 let code=ts.transpileModule(await readFile(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 for(const match of [...code.matchAll(/from ['"](\.[^'"]+)['"]/g)])code=code.replace(match[0],`from '${await moduleURL(resolve(dirname(file),match[1]+'.ts'))}'`);
 return 'data:text/javascript;base64,'+Buffer.from(code).toString('base64');
}
const {publishedNotes}=await import(await moduleURL(resolve(root,'app/notes/published.ts')));
function render(slug){
 const {document}=parseHTML(publishedNotes);
 const context=vm.createContext({document,location:{hash:slug?'#note/'+slug:''},window:{scrollTo(){},addEventListener(){}}});
 for(const script of document.querySelectorAll('script:not([src])'))vm.runInContext(script.textContent,context,{timeout:2000});
 const notes=vm.runInContext('notes',context);
 const note=slug?notes[slug]:null;
 if(slug&&!note)throw new Error('Missing published note: '+slug);
 document.querySelector(slug?'#listing':'#detail')?.remove();
 document.querySelectorAll('[hidden]').forEach(el=>el.remove());
 document.querySelectorAll('script:not([src])').forEach(el=>el.remove());
 for(const a of document.querySelectorAll('a[href]')){
  const href=a.getAttribute('href');
  if(href.startsWith('#note/'))a.setAttribute('href','/notes/'+href.slice(6));
  else if(/^\/?#(?:home|work|process|press|cv|case|project)(?:\/|$)/.test(href))a.setAttribute('href',href.replace(/^\/?#home$/,'/').replace(/^\/?#/,'/'));
 }
 const back=document.getElementById('back');
 if(back){const a=document.createElement('a');for(const attr of back.attributes)a.setAttribute(attr.name,attr.value);a.href='/notes';a.style.display='inline-block';a.style.textDecoration='none';a.style.lineHeight='normal';a.innerHTML=back.innerHTML;back.replaceWith(a);}
 const path=slug?'/notes/'+slug:'/notes';
 const title=slug?note.title+' — Notes — Yuri Choi':'Notes — Yuri Choi';
 const description=slug?(note.deck||note.title):'직접 경험한 장면과 관심사에서 시작한 노트. 브랜드 · 비즈니스 · 패션 · 뷰티 · 여행.';
 document.title=title;
 document.querySelectorAll('meta[name="description"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"]').forEach(el=>el.remove());
 function meta(name,content,property=false){const el=document.createElement('meta');el.setAttribute(property?'property':'name',name);el.content=content;document.head.append(el);}
 const canonical=document.createElement('link');canonical.rel='canonical';canonical.href='https://yurichoi.com'+path;document.head.append(canonical);
 meta('description',description);meta('og:title',title,true);meta('og:description',description,true);meta('og:url',canonical.href,true);meta('og:type',slug?'article':'website',true);meta('twitter:card','summary_large_image');meta('twitter:title',title);meta('twitter:description',description);
 const image=document.querySelector(slug?'#detail img':'#listing img')?.getAttribute('src');
 if(image){const url=new URL(image,'https://yurichoi.com').href;meta('og:image',url,true);meta('twitter:image',url);}
 const script=document.createElement('script');script.src='/notes-navigation.js';script.defer=true;document.head.append(script);
 document.documentElement.setAttribute('data-note-slug',slug);
 return {html:'<!DOCTYPE html>\n'+document.documentElement.outerHTML,title,description,path,keys:Object.keys(notes)};
}
const listing=render('');
const pages={'':listing};
for(const slug of listing.keys)pages[slug]=render(slug);
for(const page of Object.values(pages))delete page.keys;
await writeFile(resolve(root,'lib/notes-pages.json'),JSON.stringify(pages));
console.log('Generated '+(Object.keys(pages).length-1)+' public Notes pages and listing.');
