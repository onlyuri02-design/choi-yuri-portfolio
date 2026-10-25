import {notFound,redirect} from 'next/navigation';
import FinalPreviewPage from '../final-preview/page';
import {findPublicRoute,pageMetadata,publicRoutes} from '../../lib/portfolio-routes';

export function generateStaticParams(){return publicRoutes.filter(r=>r.path!=='/').map(r=>({slug:r.path.slice(1).split('/')}));}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params;const route=findPublicRoute(slug.join('/'));
 return route?pageMetadata(route):{title:'Page not found — Yuri Choi',robots:{index:false,follow:false}};
}
export default async function PublicPortfolioPage({params}:{params:Promise<{slug:string[]}>}){
 const {slug}=await params;const route=findPublicRoute(slug.join('/'));if(!route)notFound();
 if(route.route.endsWith('/details'))redirect(route.path+'#case-details');
 if('/'+slug.join('/')!==route.path)redirect(route.path);
 return <FinalPreviewPage initialRoute={route.route}/>;
}
