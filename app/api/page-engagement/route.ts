import { env } from 'cloudflare:workers';
import { handlePageEngagement } from '../../../lib/traffic';

export async function POST(request: Request) {
  return handlePageEngagement(request, env);
}
