import { d as deleteCategory } from '../../../chunks/db_BG-C3AHV.mjs';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response("Invalid id", { status: 400 });
  deleteCategory(id);
  return new Response("", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
