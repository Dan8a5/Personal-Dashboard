import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname$1, "../../dashboard.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
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
    pos         INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`);
{
  const cols = db.prepare("PRAGMA table_info(categories)").all().map((c) => c.name);
  if (!cols.includes("panel_id")) {
    db.exec("ALTER TABLE categories ADD COLUMN panel_id INTEGER REFERENCES panels(id) ON DELETE CASCADE");
  }
}
{
  const { n } = db.prepare("SELECT COUNT(*) as n FROM categories WHERE panel_id IS NULL").get();
  if (n > 0) {
    let panel = db.prepare("SELECT * FROM panels WHERE name = 'Default' LIMIT 1").get();
    if (!panel) {
      const r = db.prepare("INSERT INTO panels (name) VALUES ('Default')").run();
      panel = db.prepare("SELECT * FROM panels WHERE id = ?").get(r.lastInsertRowid);
    }
    db.prepare("UPDATE categories SET panel_id = ? WHERE panel_id IS NULL").run(panel.id);
  }
}
function getPanels() {
  return db.prepare("SELECT * FROM panels ORDER BY pos, id").all();
}
function createPanel(name) {
  const r = db.prepare("INSERT INTO panels (name) VALUES (?)").run(name);
  return db.prepare("SELECT * FROM panels WHERE id = ?").get(r.lastInsertRowid);
}
function deletePanel(id) {
  db.prepare("DELETE FROM panels WHERE id = ?").run(id);
}
function getPanelCategories(panelId) {
  const cats = db.prepare(
    "SELECT * FROM categories WHERE panel_id = ? ORDER BY pos, name"
  ).all(panelId);
  if (!cats.length) return [];
  const ids = cats.map((c) => c.id);
  const links = db.prepare(
    `SELECT * FROM links WHERE category_id IN (${ids.map(() => "?").join(",")}) ORDER BY pos, name`
  ).all(...ids);
  return cats.map((cat) => ({ ...cat, links: links.filter((l) => l.category_id === cat.id) }));
}
function createCategory(name, panelId) {
  const r = db.prepare("INSERT INTO categories (name, panel_id) VALUES (?, ?)").run(name, panelId);
  return db.prepare("SELECT * FROM categories WHERE id = ?").get(r.lastInsertRowid);
}
function deleteCategory(id) {
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}
function reorderCategories(ids) {
  const stmt = db.prepare("UPDATE categories SET pos = ? WHERE id = ?");
  db.transaction((items) => {
    for (const [pos, id] of items) stmt.run(pos, id);
  })(ids.map((id, pos) => [pos, id]));
}
function getLink(id) {
  return db.prepare("SELECT * FROM links WHERE id = ?").get(id);
}
function createLink(categoryId, name, url) {
  const r = db.prepare("INSERT INTO links (category_id, name, url) VALUES (?, ?, ?)").run(categoryId, name, url);
  return db.prepare("SELECT * FROM links WHERE id = ?").get(r.lastInsertRowid);
}
function updateLink(id, name, url) {
  db.prepare("UPDATE links SET name = ?, url = ? WHERE id = ?").run(name, url, id);
  return getLink(id);
}
function deleteLink(id) {
  db.prepare("DELETE FROM links WHERE id = ?").run(id);
}
function reorderLinks(categoryId, ids) {
  const stmt = db.prepare("UPDATE links SET pos = ?, category_id = ? WHERE id = ?");
  db.transaction((items) => {
    for (const [pos, catId, id] of items) stmt.run(pos, catId, id);
  })(ids.map((id, pos) => [pos, categoryId, id]));
}

export { reorderLinks as a, deleteLink as b, createCategory as c, deleteCategory as d, createLink as e, deletePanel as f, getLink as g, getPanelCategories as h, createPanel as i, getPanels as j, reorderCategories as r, updateLink as u };
