import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DVLVJbRP.mjs';
import { manifest } from './manifest_Iul9FRY9.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/categories/reorder.astro.mjs');
const _page2 = () => import('./pages/api/categories/_id_.astro.mjs');
const _page3 = () => import('./pages/api/categories.astro.mjs');
const _page4 = () => import('./pages/api/links/reorder.astro.mjs');
const _page5 = () => import('./pages/api/links/_id_.astro.mjs');
const _page6 = () => import('./pages/api/links.astro.mjs');
const _page7 = () => import('./pages/api/panels/_id_.astro.mjs');
const _page8 = () => import('./pages/api/panels.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/api/categories/reorder.ts", _page1],
    ["src/pages/api/categories/[id].ts", _page2],
    ["src/pages/api/categories/index.ts", _page3],
    ["src/pages/api/links/reorder.ts", _page4],
    ["src/pages/api/links/[id].ts", _page5],
    ["src/pages/api/links/index.ts", _page6],
    ["src/pages/api/panels/[id].ts", _page7],
    ["src/pages/api/panels/index.ts", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/dist/client/",
    "server": "file:///Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/dist/server/",
    "host": false,
    "port": 3000,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
