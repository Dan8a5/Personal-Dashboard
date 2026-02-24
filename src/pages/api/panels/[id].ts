import type { APIRoute } from 'astro';
import { getPanelCategories, deletePanel } from '../../../lib/db';
import { gridContent } from '../../../lib/html';

/** GET /api/panels/:id → inner HTML for #categories-grid */
export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response('Invalid id', { status: 400 });

  const cats = getPanelCategories(id);
  return new Response(gridContent(cats), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};

/** DELETE /api/panels/:id → cascade deletes all categories + links */
export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response('Invalid id', { status: 400 });

  deletePanel(id);
  return new Response('', { status: 200 });
};
