import type { APIRoute } from 'astro';
import { getLink, updateLink, deleteLink } from '../../../lib/db';
import { linkRow, linkEditForm } from '../../../lib/html';

/** GET /api/links/:id          → display row
 *  GET /api/links/:id?edit=1  → edit form  */
export const GET: APIRoute = async ({ params, url }) => {
  const id   = Number(params.id);
  const link = getLink(id);
  if (!link) return new Response('Not found', { status: 404 });

  const edit = url.searchParams.get('edit') === '1';
  const html = edit ? linkEditForm(link) : linkRow(link);

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};

/** PUT /api/links/:id → update name/url, return updated row */
export const PUT: APIRoute = async ({ params, request }) => {
  const id          = Number(params.id);
  const form        = await request.formData();
  const name        = (form.get('name') as string | null)?.trim();
  const url         = (form.get('url')  as string | null)?.trim();
  const description = (form.get('description') as string | null)?.trim() || null;

  if (!id || !name || !url) {
    return new Response('Missing fields', { status: 400 });
  }

  const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const updated  = updateLink(id, name, finalUrl, description);

  if (!updated) return new Response('Not found', { status: 404 });

  return new Response(linkRow(updated), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};

/** DELETE /api/links/:id → remove row (HTMX outerHTML swap = empty = gone) */
export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response('Invalid id', { status: 400 });

  deleteLink(id);
  return new Response('', { status: 200 });
};
