import type { APIRoute } from 'astro';
import { reorderCategories } from '../../../lib/db';

export const PUT: APIRoute = async ({ request }) => {
  let body: unknown;
  try { body = await request.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  const { ids } = body as { ids?: unknown };
  if (!Array.isArray(ids)) return new Response('ids must be an array', { status: 400 });

  reorderCategories(ids.map(Number));
  return new Response('', { status: 200 });
};
