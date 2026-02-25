import type { Link, Category, Panel } from './db';

/** Escape HTML entities to prevent XSS. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Extract a readable domain from a URL for the subtitle line. */
function domain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return ''; }
}

// ── Panel tab ─────────────────────────────────────────────────────────────────

export function panelTabWrap(panel: Panel): string {
  return `
<div class="panel-tab-wrap inline-flex items-center" id="panel-tab-wrap-${panel.id}">
  <button
    role="tab"
    class="tab text-xs font-semibold tracking-widest uppercase"
    :class="activePanel === ${panel.id} ? 'tab-active' : ''"
    @click="activePanel = ${panel.id}"
    hx-get="/api/panels/${panel.id}"
    hx-target="#categories-grid"
    hx-swap="innerHTML">${esc(panel.name)}</button><button
    class="panel-del btn btn-ghost btn-xs text-base-content/40 hover:text-error"
    hx-delete="/api/panels/${panel.id}"
    hx-swap="none"
    hx-confirm="Delete &quot;${esc(panel.name)}&quot; and all its categories?"
    hx-on::after-request="if(event.detail.successful) location.reload()"
    title="Delete panel">&times;</button>
</div>`.trim();
}

// ── Category grid content ─────────────────────────────────────────────────────

export function gridContent(cats: Array<Category & { links: Link[] }>): string {
  if (!cats.length) {
    return `<div class="py-14 text-xs tracking-wide text-base-content/40"><p class="uppercase">No categories yet.</p><small class="block mt-1 opacity-60">click &ldquo;+ CATEGORY&rdquo; to add one.</small></div>`;
  }
  return cats.map(cat => categoryCard(cat, cat.links, cats)).join('\n');
}

// ── Link rows ─────────────────────────────────────────────────────────────────

const FAVICON_FALLBACK = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">' +
  '<path fill="#888" d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c0 .091-.006.18-.018.268A2 2 0 0 1 7 9.5H4a2 2 0 0 1 0-4h1.535c.218-.376.495-.714.82-1zm3.292 5H12a3 3 0 0 0 0-6H9a3 3 0 0 0-2.83 4H6c0-.091.006-.18.018-.268A2 2 0 0 1 9 6.5h3a2 2 0 0 1 0 4H9.465c-.218.376-.495.714-.82 1z"/>' +
  '</svg>'
);

/** Single link row — drag-handle + favicon + bold name + description/domain subtitle. */
export function linkRow(link: Link): string {
  const d = domain(link.url);
  const subtitle = link.description
    ? `<span class="link-desc block text-xs text-base-content/50 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">${esc(link.description)}</span>`
    : (d ? `<span class="link-domain block text-xs text-base-content/50 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">${esc(d)}</span>` : '');
  const faviconSrc = d
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=32`
    : FAVICON_FALLBACK;
  return `
<li id="link-${link.id}" class="link-item flex items-start gap-2 py-2">
  <span class="drag-handle cursor-grab text-base-content/30 select-none text-base leading-none mt-0.5 shrink-0">&#x2261;</span>
  <img src="${faviconSrc}" class="link-favicon shrink-0 w-4 h-4 rounded-sm mt-0.5 object-contain" width="16" height="16" alt="" loading="lazy" onerror="this.onerror=null;this.src='${FAVICON_FALLBACK}'">
  <div class="link-body flex-1 min-w-0">
    <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" class="link-name block text-sm font-semibold tracking-wide uppercase text-base-content overflow-hidden text-ellipsis whitespace-nowrap hover:underline underline-offset-2">${esc(link.name)}</a>
    ${subtitle}
  </div>
  <span class="link-actions flex gap-1 shrink-0 pt-0.5">
    <button
      hx-get="/api/links/${link.id}?edit=1"
      hx-target="#link-${link.id}"
      hx-swap="outerHTML"
      class="btn btn-ghost btn-xs">EDIT</button>
    <button
      hx-delete="/api/links/${link.id}"
      hx-target="#link-${link.id}"
      hx-swap="outerHTML"
      hx-confirm="Delete &quot;${esc(link.name)}&quot;?"
      class="btn btn-ghost btn-xs text-error">DEL</button>
  </span>
</li>`.trim();
}

/** Inline edit form replacing the link row. */
export function linkEditForm(link: Link): string {
  return `
<li id="link-${link.id}" class="link-item link-editing flex items-start gap-2 py-2">
  <span class="drag-handle cursor-grab text-base-content/30 select-none text-base leading-none mt-1 shrink-0">&#x2261;</span>
  <form
    hx-put="/api/links/${link.id}"
    hx-target="#link-${link.id}"
    hx-swap="outerHTML"
    class="edit-form flex items-center gap-2 flex-1 flex-wrap">
    <input name="name" value="${esc(link.name)}" placeholder="NAME" required class="input input-bordered input-xs flex-1 min-w-20" autocomplete="off">
    <input name="url"  value="${esc(link.url)}"  placeholder="https://…" required class="input input-bordered input-xs flex-[2] min-w-28" autocomplete="off">
    <input name="description" value="${esc(link.description ?? '')}" placeholder="Description (optional)" class="input input-bordered input-xs flex-[2] min-w-28" autocomplete="off">
    <button type="submit" class="btn btn-primary btn-xs">SAVE</button>
    <button
      type="button"
      hx-get="/api/links/${link.id}"
      hx-target="#link-${link.id}"
      hx-swap="outerHTML"
      class="btn btn-ghost btn-xs">CANCEL</button>
  </form>
</li>`.trim();
}

// ── Category section ──────────────────────────────────────────────────────────

/** Full category section. */
export function categoryCard(cat: Category, links: Link[] = [], panelCats: Category[] = []): string {
  const rows = links.map(linkRow).join('\n');
  const catOptions = (panelCats.length ? panelCats : [cat])
    .map(c => `<option value="${c.id}"${c.id === cat.id ? ' selected' : ''}>${esc(c.name)}</option>`)
    .join('');
  return `
<section id="category-${cat.id}" class="category-section pt-6" x-data="{ adding: false, renaming: false }">

  <div class="category-header flex items-center gap-3 pb-2">
    <span class="cat-drag drag-handle cursor-grab text-base-content/30 select-none text-base leading-none shrink-0" title="Drag to reorder">&#x2261;</span>
    <h2 class="category-name text-xs font-bold tracking-widest uppercase cursor-pointer hover:opacity-70 shrink-0" @click="renaming = true" title="Click to rename">${esc(cat.name)}</h2>
    <span class="flex-1 h-px bg-base-300"></span>
    <div class="category-actions flex gap-1 shrink-0">
      <button
        @click="adding = !adding"
        class="btn btn-ghost btn-xs"
        x-text="adding ? 'CANCEL' : '+ ADD'"></button>
      <button
        hx-delete="/api/categories/${cat.id}"
        hx-target="#category-${cat.id}"
        hx-swap="outerHTML"
        hx-confirm="Delete &quot;${esc(cat.name)}&quot; and all its links?"
        class="btn btn-ghost btn-xs text-error">DEL</button>
    </div>
  </div>

  <ul id="links-${cat.id}" class="links-list list-none p-0">
    ${rows}
  </ul>

  <!-- Add link modal -->
  <div class="add-link-modal fixed inset-0 bg-black/40 flex items-center justify-center z-50" x-show="adding" x-cloak @click.self="adding = false">
    <div class="bg-base-200 border border-base-300 rounded-xl flex flex-col gap-4 w-96 max-w-lg p-6 shadow-2xl">
      <p class="text-xs font-bold tracking-widest uppercase">Add Link</p>
      <form
        hx-post="/api/links"
        hx-target="#links-${cat.id}"
        hx-swap="beforeend"
        hx-on::after-request="if (event.detail.successful) { this.reset(); this.setAttribute('hx-target','#links-${cat.id}'); Alpine.evaluate(this.closest('[x-data]'), 'adding = false'); }"
        class="add-link-form-modal flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs tracking-widest uppercase text-base-content/50">Name</label>
          <input name="name" required class="input input-bordered input-sm w-full" autocomplete="off">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs tracking-widest uppercase text-base-content/50">Description</label>
          <input name="description" class="input input-bordered input-sm w-full" autocomplete="off">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs tracking-widest uppercase text-base-content/50">URL</label>
          <input name="url" placeholder="https://…" required class="input input-bordered input-sm w-full" autocomplete="off">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs tracking-widest uppercase text-base-content/50">Category</label>
          <select name="category_id" class="select select-bordered select-sm w-full"
            onchange="this.closest('form').setAttribute('hx-target','#links-'+this.value)">
            ${catOptions}
          </select>
        </div>
        <div class="flex justify-end gap-2 mt-1">
          <button type="button" @click="adding = false" class="btn btn-ghost btn-sm">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Add</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Rename modal -->
  <div class="rename-overlay fixed inset-0 bg-black/40 flex items-center justify-center z-50" x-show="renaming" x-cloak @click.self="renaming = false">
    <div class="bg-base-200 border border-base-300 rounded-xl flex flex-col gap-3 min-w-72 p-6 shadow-2xl">
      <p class="text-xs font-bold tracking-widest uppercase text-base-content/50">Rename Category</p>
      <form
        hx-put="/api/categories/${cat.id}"
        hx-target="#category-${cat.id}"
        hx-swap="outerHTML"
        class="rename-form flex items-center gap-2">
        <input name="name" value="${esc(cat.name)}" placeholder="Category name" required
               class="input input-bordered input-sm flex-1" autocomplete="off">
        <button type="submit" class="btn btn-primary btn-sm">RENAME</button>
        <button type="button" @click="renaming = false" class="btn btn-ghost btn-sm">CANCEL</button>
      </form>
    </div>
  </div>

</section>`.trim();
}
