import pages from '../../../lib/notes-pages.json';
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const page=Object.hasOwn(pages,slug)?(pages as Record<string,{html:string}>)[slug]:undefined;
 if(!page)return new Response('Note not found',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 return new Response(page.html,{headers:{'Content-Type':'text/html; charset=utf-8'}});
}
