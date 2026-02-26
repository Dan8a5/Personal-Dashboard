# Personal Link Dashboard

A self-hosted personal dashboard for organizing and accessing your links. Built with the AHA stack: Astro SSR, HTMX, and Alpine.js.

## Features

- **Panels** — top-level tabs to separate different contexts (e.g. Work, Personal, Learning)
- **Categories** — groups of links within each panel
- **Links** — name, URL, optional description, and auto-fetched favicon
- **Drag-and-drop** — reorder links and categories via SortableJS
- **Inline editing** — edit or delete links without a page reload
- **Search/filter** — press `/` to focus the search bar and filter links by name or description
- **Keyboard shortcuts** — press `1`–`9` to switch between panels
- **Quick notes** — slide-in scratchpad drawer, auto-saved to localStorage
- **Theme toggle** — switch between Abyss (dark) and Cyberpunk (light) themes, persisted across reloads

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro](https://astro.build) (SSR, Node adapter) |
| Interactivity | [HTMX](https://htmx.org) + [Alpine.js](https://alpinejs.dev) |
| Drag-and-drop | [SortableJS](https://sortablejs.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [DaisyUI v5](https://daisyui.com) |
| Database | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Font | JetBrains Mono (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
node dist/server/entry.mjs
```

## Project Structure

```
src/
  lib/
    db.ts        # SQLite database setup and all query functions
    html.ts      # Server-side HTML fragment generators (used by HTMX endpoints)
  pages/
    index.astro  # Main page — layout, scripts, Alpine state
    api/
      panels/    # GET, POST, DELETE /api/panels
      categories/# GET, POST, PUT, DELETE /api/categories
      links/     # GET, POST, PUT, DELETE /api/links
  styles/
    global.css   # Tailwind + DaisyUI entry point
public/          # Static assets served at /
```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` – `9` | Switch to panel by position |
| `/` | Focus the search/filter input |
| `Escape` | Clear search and blur input |

## Data

The SQLite database is stored as `dashboard.db` in the project root and is excluded from version control. It is created automatically on first run.
