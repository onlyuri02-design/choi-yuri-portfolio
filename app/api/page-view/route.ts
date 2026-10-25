import { env } from 'cloudflare:workers';
import { handlePageView } from '../../../lib/traffic';

export async function POST(request: Request) {
  return handlePageView(request, env);
}
