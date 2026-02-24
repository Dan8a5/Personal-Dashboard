import { r as reorderCategories } from '../../../chunks/db_BG-C3AHV.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  const { ids } = body;
  if (!Array.isArray(ids)) return new Response("ids must be an array", { status: 400 });
  reorderCategories(ids.map(Number));
  return new Response("", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
