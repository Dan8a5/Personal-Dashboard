import type { APIRoute } from 'astro';
import { createLink } from '../../../lib/db';
import { linkRow } from '../../../lib/html';

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const categoryId  = Number(form.get('category_id'));
  const name        = (form.get('name') as string | null)?.trim();
  const url         = (form.get('url')  as string | null)?.trim();
  const description = (form.get('description') as string | null)?.trim() || null;

  if (!categoryId || !name || !url) {
    return new Response('Missing fields', { status: 400 });
  }

  // Prepend https:// if the user forgot a scheme
  const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const link = createLink(categoryId, name, finalUrl, description);
  return new Response(linkRow(link), {
    status: 201,
    headers: { 'Content-Type': 'text/html' },
  });
};
