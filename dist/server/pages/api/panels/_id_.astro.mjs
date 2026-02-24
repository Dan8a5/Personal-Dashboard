import { f as deletePanel, h as getPanelCategories } from '../../../chunks/db_BG-C3AHV.mjs';
import { g as gridContent } from '../../../chunks/html_C3wteTSU.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response("Invalid id", { status: 400 });
  const cats = getPanelCategories(id);
  return new Response(gridContent(cats), {
    status: 200,
    headers: { "Content-Type": "text/html" }
  });
};
const DELETE = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response("Invalid id", { status: 400 });
  deletePanel(id);
  return new Response("", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
