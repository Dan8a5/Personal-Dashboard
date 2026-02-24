import { a as reorderLinks } from '../../../chunks/db_BG-C3AHV.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  const { categoryId, ids } = body;
  if (!categoryId || !Array.isArray(ids)) {
    return new Response("categoryId and ids are required", { status: 400 });
  }
  reorderLinks(Number(categoryId), ids.map(Number));
  return new Response("", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
