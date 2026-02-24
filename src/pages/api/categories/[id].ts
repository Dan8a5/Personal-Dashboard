import type { APIRoute } from 'astro';
import { deleteCategory } from '../../../lib/db';

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response('Invalid id', { status: 400 });

  deleteCategory(id);
  return new Response('', { status: 200 });
};
