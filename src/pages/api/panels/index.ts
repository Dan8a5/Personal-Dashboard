import type { APIRoute } from 'astro';
import { createPanel } from '../../../lib/db';
import { panelTabWrap } from '../../../lib/html';

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const name = (form.get('name') as string | null)?.trim();

  if (!name) {
    return new Response('Name is required', { status: 400 });
  }

  const panel = createPanel(name);
  return new Response(panelTabWrap(panel), {
    status: 201,
    headers: { 'Content-Type': 'text/html' },
  });
};
