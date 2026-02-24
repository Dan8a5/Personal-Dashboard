import { i as createPanel } from '../../chunks/db_BG-C3AHV.mjs';
import { p as panelTabWrap } from '../../chunks/html_C3wteTSU.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name")?.trim();
  if (!name) {
    return new Response("Name is required", { status: 400 });
  }
  const panel = createPanel(name);
  return new Response(panelTabWrap(panel), {
    status: 201,
    headers: { "Content-Type": "text/html" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
