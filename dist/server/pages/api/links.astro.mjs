import { e as createLink } from '../../chunks/db_BG-C3AHV.mjs';
import { a as linkRow } from '../../chunks/html_C3wteTSU.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const form = await request.formData();
  const categoryId = Number(form.get("category_id"));
  const name = form.get("name")?.trim();
  const url = form.get("url")?.trim();
  if (!categoryId || !name || !url) {
    return new Response("Missing fields", { status: 400 });
  }
  const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const link = createLink(categoryId, name, finalUrl);
  return new Response(linkRow(link), {
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
