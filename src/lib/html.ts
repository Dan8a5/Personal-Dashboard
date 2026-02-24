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
  return cats.map(cat => categoryCard(cat, cat.links)).join('\n');
}

// ── Link rows ─────────────────────────────────────────────────────────────────

/** Single link row — drag-handle + bold name + description/domain subtitle. */
export function linkRow(link: Link): string {
  const d = domain(link.url);
  const subtitle = link.description
    ? `<span class="link-desc">${esc(link.description)}</span>`
    : (d ? `<span class="link-domain">${esc(d)}</span>` : '');
  return `
<li id="link-${link.id}" class="link-item">
  <span class="drag-handle">&#x2261;</span>
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
export function categoryCard(cat: Category, links: Link[] = []): string {
  const rows = links.map(linkRow).join('\n');
  return `
<section id="category-${cat.id}" class="category-section" x-data="{ adding: false }">

  <div class="category-header">
    <span class="cat-drag" title="Drag to reorder">&#x2261;</span>
    <h2 class="category-name">${esc(cat.name)}</h2>
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

  <div class="add-link-row" x-show="adding" x-cloak>
    <form
      hx-post="/api/links"
      hx-target="#links-${cat.id}"
      hx-swap="beforeend"
      hx-on::after-request="if (event.detail.successful) { this.reset(); }"
      class="add-link-form">
      <span class="drag-handle" aria-hidden="true" style="opacity:.2">&#x2261;</span>
      <input type="hidden" name="category_id" value="${cat.id}">
      <input name="name" placeholder="NAME" required class="form-input" autocomplete="off">
      <input name="url"  placeholder="https://…" required class="form-input" autocomplete="off">
      <input name="description" placeholder="Description (optional)" class="form-input desc-input" autocomplete="off">
      <button type="submit" class="btn btn-primary">ADD</button>
    </form>
  </div>

</section>`.trim();
}
