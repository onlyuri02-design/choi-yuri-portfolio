import { env } from 'cloudflare:workers';
import { readAnalytics, privateHeaders } from '../../../lib/analytics-live';
import seed from '../../../lib/analytics-snapshot.json';
export const dynamic='force-dynamic';
export async function GET(request: Request) {
  const response=await readAnalytics(request,env);
  if(!response.ok)return response;
  const data=await response.json() as Record<string,any>;
  const values:Record<string,any[]>={traffic_daily:data.history,traffic_activity:data.activity,activity_summary:[data.detail],live_presence:data.presence,traffic_regions_daily:data.regions,traffic_devices:data.devices,traffic_channels:data.channels,traffic_pages:data.pages,traffic_clicks:data.clicks,traffic_trend:data.trend};
  return Response.json({...seed,generatedAt:data.generatedAt,queries:Object.fromEntries(Object.entries(seed.queries).map(([id,q])=>[id,{...q,rows:values[id]||[],source:{...q.source,executedAt:data.generatedAt}}]))},{headers:privateHeaders});
}
