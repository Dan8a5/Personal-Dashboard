import { b as deleteLink, g as getLink, u as updateLink } from '../../../chunks/db_BG-C3AHV.mjs';
import { l as linkEditForm, a as linkRow } from '../../../chunks/html_C3wteTSU.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params, url }) => {
  const id = Number(params.id);
  const link = getLink(id);
  if (!link) return new Response("Not found", { status: 404 });
  const edit = url.searchParams.get("edit") === "1";
  const html = edit ? linkEditForm(link) : linkRow(link);
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html" }
  });
};
const PUT = async ({ params, request }) => {
  const id = Number(params.id);
  const form = await request.formData();
  const name = form.get("name")?.trim();
  const url = form.get("url")?.trim();
  if (!id || !name || !url) {
    return new Response("Missing fields", { status: 400 });
  }
  const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const updated = updateLink(id, name, finalUrl);
  if (!updated) return new Response("Not found", { status: 404 });
  return new Response(linkRow(updated), {
    status: 200,
    headers: { "Content-Type": "text/html" }
  });
};
const DELETE = async ({ params }) => {
  const id = Number(params.id);
  if (!id) return new Response("Invalid id", { status: 400 });
  deleteLink(id);
  return new Response("", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
