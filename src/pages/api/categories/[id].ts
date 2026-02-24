import type { APIRoute } from 'astro';
import { deleteCategory, updateCategory, getLinksForCategory, getPanelCategories } from '../../../lib/db';
import { categoryCard } from '../../../lib/html';

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response('Invalid id', { status: 400 });

  deleteCategory(id);
  return new Response('', { status: 200 });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id   = Number(params.id);
  const form = await request.formData();
  const name = (form.get('name') as string | null)?.trim();

  if (!id || !name) return new Response('Missing fields', { status: 400 });

  const updated = updateCategory(id, name);
  if (!updated) return new Response('Not found', { status: 404 });

  const links    = getLinksForCategory(id);
  const allCats  = getPanelCategories(updated.panel_id);
  return new Response(categoryCard(updated, links, allCats), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};
