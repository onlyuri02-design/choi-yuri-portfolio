import pages from '../../lib/notes-pages.json';
export function GET(){return new Response(pages[''].html,{headers:{'Content-Type':'text/html; charset=utf-8'}});}
