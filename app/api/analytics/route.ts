import { env } from 'cloudflare:workers';
import { readAnalytics } from '../../../lib/analytics-live';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) { return readAnalytics(request, env); }
