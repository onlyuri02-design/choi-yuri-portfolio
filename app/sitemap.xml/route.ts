import {publicRoutes,siteOrigin} from '../../lib/portfolio-routes';
import notes from '../../lib/notes-pages.json';
export function GET(){
 const paths=[...publicRoutes.map(r=>r.path),...Object.values(notes).map(n=>n.path),'/aitoollibrary'];
 return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(paths)].map(path=>'<url><loc>'+siteOrigin+path+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
