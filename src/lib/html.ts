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
<div class="panel-tab-wrap" id="panel-tab-wrap-${panel.id}">
  <button
    class="panel-tab"
    :class="activePanel === ${panel.id} ? 'active' : ''"
    @click="activePanel = ${panel.id}"
    hx-get="/api/panels/${panel.id}"
    hx-target="#categories-grid"
    hx-swap="innerHTML">${esc(panel.name)}</button><button
    class="panel-del"
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
    return `<div class="empty-state"><p>No categories yet.</p><small>click &ldquo;+ CATEGORY&rdquo; to add one.</small></div>`;
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
    ? `<span class="link-desc">${esc(link.description)}</span>`
    : (d ? `<span class="link-domain">${esc(d)}</span>` : '');
  const faviconSrc = d
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=32`
    : FAVICON_FALLBACK;
  return `
<li id="link-${link.id}" class="link-item">
  <span class="drag-handle">&#x2261;</span>
  <img src="${faviconSrc}" class="link-favicon" width="16" height="16" alt="" loading="lazy" onerror="this.onerror=null;this.src='${FAVICON_FALLBACK}'">
  <div class="link-body">
    <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" class="link-name">${esc(link.name)}</a>
    ${subtitle}
  </div>
  <span class="link-actions">
    <button
      hx-get="/api/links/${link.id}?edit=1"
      hx-target="#link-${link.id}"
      hx-swap="outerHTML"
      class="btn">EDIT</button>
    <button
      hx-delete="/api/links/${link.id}"
      hx-target="#link-${link.id}"
      hx-swap="outerHTML"
      hx-confirm="Delete &quot;${esc(link.name)}&quot;?"
      class="btn btn-danger">DEL</button>
  </span>
</li>`.trim();
}

/** Inline edit form replacing the link row. */
export function linkEditForm(link: Link): string {
  return `
<li id="link-${link.id}" class="link-item link-editing">
  <span class="drag-handle">&#x2261;</span>
  <form
    hx-put="/api/links/${link.id}"
    hx-target="#link-${link.id}"
    hx-swap="outerHTML"
    class="edit-form">
    <input name="name" value="${esc(link.name)}" placeholder="NAME" required class="form-input" autocomplete="off">
    <input name="url"  value="${esc(link.url)}"  placeholder="https://…" required class="form-input url-input" autocomplete="off">
    <input name="description" value="${esc(link.description ?? '')}" placeholder="Description (optional)" class="form-input desc-input" autocomplete="off">
    <button type="submit" class="btn btn-primary">SAVE</button>
    <button
      type="button"
      hx-get="/api/links/${link.id}"
      hx-target="#link-${link.id}"
      hx-swap="outerHTML"
      class="btn">CANCEL</button>
  </form>
</li>`.trim();
}

// ── Category section ──────────────────────────────────────────────────────────

/** Full-width category section (list layout, not card). */
export function categoryCard(cat: Category, links: Link[] = [], panelCats: Category[] = []): string {
  const rows = links.map(linkRow).join('\n');
  const catOptions = (panelCats.length ? panelCats : [cat])
    .map(c => `<option value="${c.id}"${c.id === cat.id ? ' selected' : ''}>${esc(c.name)}</option>`)
    .join('');
  return `
<section id="category-${cat.id}" class="category-section" x-data="{ adding: false, renaming: false }">

  <div class="category-header">
    <span class="cat-drag" title="Drag to reorder">&#x2261;</span>
    <h2 class="category-name" @click="renaming = true" title="Click to rename">${esc(cat.name)}</h2>
    <span class="cat-rule"></span>
    <div class="category-actions">
      <button
        @click="adding = !adding"
        class="btn"
        x-text="adding ? 'CANCEL' : '+ ADD'"></button>
      <button
        hx-delete="/api/categories/${cat.id}"
        hx-target="#category-${cat.id}"
        hx-swap="outerHTML"
        hx-confirm="Delete &quot;${esc(cat.name)}&quot; and all its links?"
        class="btn btn-danger">DEL</button>
    </div>
  </div>

  <ul id="links-${cat.id}" class="links-list">
    ${rows}
  </ul>

  <div class="add-link-modal" x-show="adding" x-cloak @click.self="adding = false">
    <div class="add-link-dialog">
      <p class="dialog-title">Add Link</p>
      <form
        hx-post="/api/links"
        hx-target="#links-${cat.id}"
        hx-swap="beforeend"
        hx-on::after-request="if (event.detail.successful) { this.reset(); this.setAttribute('hx-target','#links-${cat.id}'); Alpine.evaluate(this.closest('[x-data]'), 'adding = false'); }"
        class="add-link-form-modal">
        <div class="field-group">
          <label class="field-label">Name</label>
          <input name="name" required class="form-input" autocomplete="off">
        </div>
        <div class="field-group">
          <label class="field-label">Description</label>
          <input name="description" class="form-input" autocomplete="off">
        </div>
        <div class="field-group">
          <label class="field-label">URL</label>
          <input name="url" placeholder="https://…" required class="form-input" autocomplete="off">
        </div>
        <div class="field-group">
          <label class="field-label">Category</label>
          <select name="category_id" class="form-select"
            onchange="this.closest('form').setAttribute('hx-target','#links-'+this.value)">
            ${catOptions}
          </select>
        </div>
        <div class="dialog-actions">
          <button type="button" @click="adding = false" class="btn">Cancel</button>
          <button type="submit" class="btn btn-primary">Add</button>
        </div>
      </form>
    </div>
  </div>

  <div class="rename-overlay" x-show="renaming" x-cloak @click.self="renaming = false">
    <div class="rename-dialog">
      <p class="rename-label">RENAME CATEGORY</p>
      <form
        hx-put="/api/categories/${cat.id}"
        hx-target="#category-${cat.id}"
        hx-swap="outerHTML"
        class="rename-form">
        <input name="name" value="${esc(cat.name)}" placeholder="Category name" required
               class="form-input" autocomplete="off" style="min-width:200px">
        <button type="submit" class="btn btn-primary">RENAME</button>
        <button type="button" @click="renaming = false" class="btn">CANCEL</button>
      </form>
    </div>
  </div>

</section>`.trim();
}
