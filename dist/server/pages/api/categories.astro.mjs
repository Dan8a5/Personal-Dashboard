import { c as createCategory } from '../../chunks/db_BG-C3AHV.mjs';
import { c as categoryCard } from '../../chunks/html_C3wteTSU.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name")?.trim();
  const panelId = Number(form.get("panel_id"));
  if (!name || !panelId) {
    return new Response("Missing fields", { status: 400 });
  }
  const cat = createCategory(name, panelId);
  return new Response(categoryCard(cat, []), {
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
