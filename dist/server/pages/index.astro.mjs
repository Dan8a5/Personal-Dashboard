import { f as createComponent, r as renderTemplate, j as renderComponent, h as addAttribute, k as renderHead, l as Fragment, u as unescapeHTML } from '../chunks/astro/server_eKfe1guF.mjs';
import 'kleur/colors';
import { j as getPanels, h as getPanelCategories } from '../chunks/db_BG-C3AHV.mjs';
import { g as gridContent, p as panelTabWrap } from '../chunks/html_C3wteTSU.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const panels = getPanels();
  const firstPanel = panels[0] ?? null;
  const firstPanelId = firstPanel?.id ?? null;
  const initialCats = firstPanel ? getPanelCategories(firstPanel.id) : [];
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-j7pv25f6> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dashboard</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"><script src="https://unpkg.com/htmx.org@1.9.12/dist/htmx.min.js" defer><\/script><script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer><\/script><script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.3/Sortable.min.js" defer><\/script>', "</head> <body", ' data-astro-cid-j7pv25f6> <!-- \u2500\u2500 Topbar: label + live clock \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <div class="topbar" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>OPS DASHBOARD</span> <span id="clock" data-astro-cid-j7pv25f6></span> </div> <!-- \u2500\u2500 Page header: branding + panel controls \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <header class="page-header" data-astro-cid-j7pv25f6> <div class="header-brand" data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Command</h1> <p data-astro-cid-j7pv25f6>Mission Control</p> </div> <div class="header-right" data-astro-cid-j7pv25f6> <!-- Panel tabs + add panel --> <div class="panel-bar" data-astro-cid-j7pv25f6> <nav id="panel-tabs-inner" class="panel-tabs" data-astro-cid-j7pv25f6> ', ` </nav> <div class="add-panel-ctrl" data-astro-cid-j7pv25f6> <button @click="addingPanel = !addingPanel" class="add-panel-btn" x-text="addingPanel ? '\xD7' : '+'" data-astro-cid-j7pv25f6></button> <form x-show="addingPanel" x-cloak hx-post="/api/panels" hx-target="#panel-tabs-inner" hx-swap="beforeend" hx-on::after-request="if (event.detail.successful) { addingPanel = false; $el.reset(); }" class="add-panel-form" data-astro-cid-j7pv25f6> <input name="name" placeholder="Panel name" required class="form-input" autocomplete="off" style="width: 130px;" data-astro-cid-j7pv25f6> <button type="submit" class="btn btn-primary" data-astro-cid-j7pv25f6>CREATE</button> </form> </div> </div> <!-- Add category (hidden until a panel exists) --> <div class="add-cat-ctrl" x-show="activePanel !== null" data-astro-cid-j7pv25f6> <button @click="addingCategory = !addingCategory" class="btn" x-text="addingCategory ? 'CANCEL' : '+ CATEGORY'" data-astro-cid-j7pv25f6></button> <form x-show="addingCategory" x-cloak hx-post="/api/categories" hx-target="#categories-grid" hx-swap="beforeend" hx-on::after-request="if (event.detail.successful) { addingCategory = false; $el.reset(); }" class="add-cat-form" data-astro-cid-j7pv25f6> <input type="hidden" name="panel_id" :value="activePanel" data-astro-cid-j7pv25f6> <input name="name" placeholder="Category name" required class="form-input" autocomplete="off" style="width: 160px;" data-astro-cid-j7pv25f6> <button type="submit" class="btn btn-primary" data-astro-cid-j7pv25f6>CREATE</button> </form> </div> </div> </header> <!-- \u2500\u2500 Category list \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 --> <main data-astro-cid-j7pv25f6> <div id="categories-grid" data-astro-cid-j7pv25f6> `, " </div> </main> <!-- \u2500\u2500 SortableJS drag-and-drop \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->  <!-- Live clock -->  </body> </html>"])), renderHead(), addAttribute(`{ activePanel: ${firstPanelId ?? "null"}, addingPanel: false, addingCategory: false }`, "x-data"), panels.map((p) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(panelTabWrap(p))}` })}`), panels.length === 0 ? renderTemplate`<div class="no-panels" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>No panels yet.</p> <small data-astro-cid-j7pv25f6>Click &ldquo;+&rdquo; above to create your first panel.</small> </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(gridContent(initialCats))}` })}`);
}, "/Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/src/pages/index.astro", void 0);

const $$file = "/Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
