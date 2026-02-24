import type { APIRoute } from 'astro';
import { createCategory } from '../../../lib/db';
import { categoryCard } from '../../../lib/html';

export const POST: APIRoute = async ({ request }) => {
  const form     = await request.formData();
  const name     = (form.get('name')     as string | null)?.trim();
  const panelId  = Number(form.get('panel_id'));

  if (!name || !panelId) {
    return new Response('Missing fields', { status: 400 });
  }

  const cat = createCategory(name, panelId);
  return new Response(categoryCard(cat, []), {
    status: 201,
    headers: { 'Content-Type': 'text/html' },
  });
};
