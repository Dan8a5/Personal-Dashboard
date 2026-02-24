import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_4Gx2MST5.mjs';
import 'es-module-lexer';
import { n as decodeKey } from './chunks/astro/server_eKfe1guF.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/categories/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/categories\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/categories/reorder.ts","pathname":"/api/categories/reorder","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/categories/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/categories\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/categories/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/categories","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/categories\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/categories/index.ts","pathname":"/api/categories","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/links/reorder","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/links\\/reorder\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"links","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/links/reorder.ts","pathname":"/api/links/reorder","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/links/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/links\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"links","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/links/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/links","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/links\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"links","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/links/index.ts","pathname":"/api/links","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/panels/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/panels\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"panels","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/panels/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/panels","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/panels\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"panels","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/panels/index.ts","pathname":"/api/panels","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const u=[\"JAN\",\"FEB\",\"MAR\",\"APR\",\"MAY\",\"JUN\",\"JUL\",\"AUG\",\"SEP\",\"OCT\",\"NOV\",\"DEC\"];function c(){const n=new Date,r=`${u[n.getMonth()]} ${String(n.getDate()).padStart(2,\"0\")}, ${n.getFullYear()}`,a=`${String(n.getHours()).padStart(2,\"0\")}:${String(n.getMinutes()).padStart(2,\"0\")}:${String(n.getSeconds()).padStart(2,\"0\")}`,i=document.getElementById(\"clock\");i&&(i.textContent=`${r}  ${a}`)}c();setInterval(c,1e3);document.addEventListener(\"DOMContentLoaded\",function(){function n(t){const e=t.closest('[id^=\"category-\"]');if(!e)return;const o=Number(e.id.replace(\"category-\",\"\")),g=Array.from(t.querySelectorAll(\":scope > .link-item\")).map(l=>Number(l.id.replace(\"link-\",\"\")));fetch(\"/api/links/reorder\",{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({categoryId:o,ids:g})})}let r=null;const a=new Map;function i(t){a.has(t)&&a.get(t).destroy();const e=Sortable.create(t,{group:\"links\",handle:\".drag-handle\",draggable:\".link-item\",animation:130,ghostClass:\"drag-ghost\",chosenClass:\"drag-chosen\",onEnd(o){n(o.to),o.from!==o.to&&n(o.from)}});a.set(t,e)}function d(){const t=document.getElementById(\"categories-grid\");t&&(r&&(r.destroy(),r=null),r=Sortable.create(t,{handle:\".cat-drag\",draggable:\".category-section\",animation:130,ghostClass:\"drag-ghost\",chosenClass:\"drag-chosen\",onEnd(){const e=Array.from(t.querySelectorAll(\":scope > .category-section\")).map(o=>Number(o.id.replace(\"category-\",\"\")));fetch(\"/api/categories/reorder\",{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({ids:e})})}}))}function s(){d(),document.querySelectorAll(\".links-list\").forEach(i)}s(),document.addEventListener(\"htmx:afterSettle\",function(t){const e=t.detail.target;e&&(e.id===\"categories-grid\"||e.closest?.(\"#categories-grid\"))&&s()})});\n"}],"styles":[{"type":"external","src":"/_astro/index.CenTg3ju.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/categories/reorder@_@ts":"pages/api/categories/reorder.astro.mjs","\u0000@astro-page:src/pages/api/categories/[id]@_@ts":"pages/api/categories/_id_.astro.mjs","\u0000@astro-page:src/pages/api/categories/index@_@ts":"pages/api/categories.astro.mjs","\u0000@astro-page:src/pages/api/links/reorder@_@ts":"pages/api/links/reorder.astro.mjs","\u0000@astro-page:src/pages/api/links/[id]@_@ts":"pages/api/links/_id_.astro.mjs","\u0000@astro-page:src/pages/api/links/index@_@ts":"pages/api/links.astro.mjs","\u0000@astro-page:src/pages/api/panels/[id]@_@ts":"pages/api/panels/_id_.astro.mjs","\u0000@astro-page:src/pages/api/panels/index@_@ts":"pages/api/panels.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","/Users/danielochoa/Repos/flaviocopes/wk1/personal_dashboard/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_Iul9FRY9.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.Cj4VuqYK.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.CenTg3ju.css"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"ZZLmhd3oFN5sDRnI6/768LXdPAOWJasklEXALVDyZiw=","experimentalEnvGetSecretEnabled":false});

export { manifest };
