import type { APIRoute } from 'astro';
import { reorderLinks } from '../../../lib/db';

export const PUT: APIRoute = async ({ request }) => {
  let body: unknown;
  try { body = await request.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  const { categoryId, ids } = body as { categoryId?: unknown; ids?: unknown };
  if (!categoryId || !Array.isArray(ids)) {
    return new Response('categoryId and ids are required', { status: 400 });
  }

  reorderLinks(Number(categoryId), ids.map(Number));
  return new Response('', { status: 200 });
};
