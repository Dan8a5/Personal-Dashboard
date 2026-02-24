import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../dashboard.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS panels (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pos  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS categories (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    panel_id INTEGER REFERENCES panels(id) ON DELETE CASCADE,
    name     TEXT NOT NULL,
    pos      INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS links (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name        TEXT NOT NULL,
    url         TEXT NOT NULL,
    description TEXT,
    pos         INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`);

// ── Migration: add panel_id column to pre-existing categories tables ──────────
{
  const cols = (db.prepare('PRAGMA table_info(categories)').all() as { name: string }[]).map(c => c.name);
  if (!cols.includes('panel_id')) {
    db.exec('ALTER TABLE categories ADD COLUMN panel_id INTEGER REFERENCES panels(id) ON DELETE CASCADE');
  }
}

// ── Migration: add description column to pre-existing links tables ────────────
{
  const cols = (db.prepare('PRAGMA table_info(links)').all() as { name: string }[]).map(c => c.name);
  if (!cols.includes('description')) {
    db.exec('ALTER TABLE links ADD COLUMN description TEXT');
  }
}

// ── Migration: assign orphaned categories to a "Default" panel ────────────────
{
  const { n } = db.prepare('SELECT COUNT(*) as n FROM categories WHERE panel_id IS NULL').get() as { n: number };
  if (n > 0) {
    let panel = db.prepare("SELECT * FROM panels WHERE name = 'Default' LIMIT 1").get() as Panel | undefined;
    if (!panel) {
      const r = db.prepare("INSERT INTO panels (name) VALUES ('Default')").run();
      panel = db.prepare('SELECT * FROM panels WHERE id = ?').get(r.lastInsertRowid) as Panel;
    }
    db.prepare('UPDATE categories SET panel_id = ? WHERE panel_id IS NULL').run(panel.id);
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type Panel    = { id: number; name: string; pos: number };
export type Category = { id: number; panel_id: number; name: string; pos: number };
export type Link     = { id: number; category_id: number; name: string; url: string; description: string | null; pos: number };
export type CategoryWithLinks = Category & { links: Link[] };

// ── Panels ────────────────────────────────────────────────────────────────────

export function getPanels(): Panel[] {
  return db.prepare('SELECT * FROM panels ORDER BY pos, id').all() as Panel[];
}

export function createPanel(name: string): Panel {
  const r = db.prepare('INSERT INTO panels (name) VALUES (?)').run(name);
  return db.prepare('SELECT * FROM panels WHERE id = ?').get(r.lastInsertRowid) as Panel;
}

export function deletePanel(id: number): void {
  db.prepare('DELETE FROM panels WHERE id = ?').run(id);
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getPanelCategories(panelId: number): CategoryWithLinks[] {
  const cats = db.prepare(
    'SELECT * FROM categories WHERE panel_id = ? ORDER BY pos, name'
  ).all(panelId) as Category[];

  if (!cats.length) return [];

  const ids   = cats.map(c => c.id);
  const links = db.prepare(
    `SELECT * FROM links WHERE category_id IN (${ids.map(() => '?').join(',')}) ORDER BY pos, name`
  ).all(...ids) as Link[];

  return cats.map(cat => ({ ...cat, links: links.filter(l => l.category_id === cat.id) }));
}

export function createCategory(name: string, panelId: number): Category {
  const r = db.prepare('INSERT INTO categories (name, panel_id) VALUES (?, ?)').run(name, panelId);
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(r.lastInsertRowid) as Category;
}

export function deleteCategory(id: number): void {
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
}

export function updateCategory(id: number, name: string): Category | undefined {
  db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, id);
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
}

export function getLinksForCategory(categoryId: number): Link[] {
  return db.prepare('SELECT * FROM links WHERE category_id = ? ORDER BY pos, name').all(categoryId) as Link[];
}

export function reorderCategories(ids: number[]): void {
  const stmt = db.prepare('UPDATE categories SET pos = ? WHERE id = ?');
  db.transaction((items: Array<[number, number]>) => {
    for (const [pos, id] of items) stmt.run(pos, id);
  })(ids.map((id, pos) => [pos, id]));
}

// ── Links ─────────────────────────────────────────────────────────────────────

export function getLink(id: number): Link | undefined {
  return db.prepare('SELECT * FROM links WHERE id = ?').get(id) as Link | undefined;
}

export function createLink(categoryId: number, name: string, url: string, description?: string | null): Link {
  const r = db.prepare('INSERT INTO links (category_id, name, url, description) VALUES (?, ?, ?, ?)').run(categoryId, name, url, description ?? null);
  return db.prepare('SELECT * FROM links WHERE id = ?').get(r.lastInsertRowid) as Link;
}

export function updateLink(id: number, name: string, url: string, description?: string | null): Link | undefined {
  db.prepare('UPDATE links SET name = ?, url = ?, description = ? WHERE id = ?').run(name, url, description ?? null, id);
  return getLink(id);
}

export function deleteLink(id: number): void {
  db.prepare('DELETE FROM links WHERE id = ?').run(id);
}

/**
 * Bulk-update pos and category_id for every link ID in `ids`, in order.
 * Called once for the destination list and once for the source list when
 * a link is dragged between categories.
 */
export function reorderLinks(categoryId: number, ids: number[]): void {
  const stmt = db.prepare('UPDATE links SET pos = ?, category_id = ? WHERE id = ?');
  db.transaction((items: Array<[number, number, number]>) => {
    for (const [pos, catId, id] of items) stmt.run(pos, catId, id);
  })(ids.map((id, pos) => [pos, categoryId, id]));
}

export default db;
