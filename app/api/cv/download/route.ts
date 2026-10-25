import {env} from 'cloudflare:workers';
import {downloadCV,privateHeaders,type CVBindings} from '../../../../lib/cv-access';
export const dynamic='force-dynamic';
export async function POST(request:Request){try{return await downloadCV(request,env as CVBindings);}catch{console.error('CV download unavailable');return Response.json({error:'CV not available'},{status:503,headers:privateHeaders});}}
export function GET(){return Response.json({error:'Method not allowed'},{status:405,headers:{...privateHeaders,Allow:'POST'}});}
