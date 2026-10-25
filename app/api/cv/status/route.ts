import {env} from 'cloudflare:workers';
import {cvReady,privateHeaders,type CVBindings} from '../../../../lib/cv-access';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json({ready:await cvReady(env as CVBindings)},{headers:privateHeaders});}catch{console.error('CV storage unavailable');return Response.json({ready:false},{status:503,headers:privateHeaders});}}
