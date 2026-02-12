globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DV3BX0HO.mjs';
import { manifest } from './manifest_DEBwk2at.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/blog/edit.astro.mjs');
const _page4 = () => import('./pages/admin/blog/new.astro.mjs');
const _page5 = () => import('./pages/admin/config.astro.mjs');
const _page6 = () => import('./pages/admin/events/edit.astro.mjs');
const _page7 = () => import('./pages/admin/events/new.astro.mjs');
const _page8 = () => import('./pages/admin/login.astro.mjs');
const _page9 = () => import('./pages/admin/logout.astro.mjs');
const _page10 = () => import('./pages/admin/officers/edit.astro.mjs');
const _page11 = () => import('./pages/admin/officers/new.astro.mjs');
const _page12 = () => import('./pages/admin/pages/edit.astro.mjs');
const _page13 = () => import('./pages/admin/pages/new.astro.mjs');
const _page14 = () => import('./pages/admin/service/edit.astro.mjs');
const _page15 = () => import('./pages/admin/service/new.astro.mjs');
const _page16 = () => import('./pages/admin.astro.mjs');
const _page17 = () => import('./pages/blog/_slug_.astro.mjs');
const _page18 = () => import('./pages/blog.astro.mjs');
const _page19 = () => import('./pages/community-service.astro.mjs');
const _page20 = () => import('./pages/contact.astro.mjs');
const _page21 = () => import('./pages/events.astro.mjs');
const _page22 = () => import('./pages/officers.astro.mjs');
const _page23 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/blog/edit.astro", _page3],
    ["src/pages/admin/blog/new.astro", _page4],
    ["src/pages/admin/config.astro", _page5],
    ["src/pages/admin/events/edit.astro", _page6],
    ["src/pages/admin/events/new.astro", _page7],
    ["src/pages/admin/login.astro", _page8],
    ["src/pages/admin/logout.ts", _page9],
    ["src/pages/admin/officers/edit.astro", _page10],
    ["src/pages/admin/officers/new.astro", _page11],
    ["src/pages/admin/pages/edit.astro", _page12],
    ["src/pages/admin/pages/new.astro", _page13],
    ["src/pages/admin/service/edit.astro", _page14],
    ["src/pages/admin/service/new.astro", _page15],
    ["src/pages/admin/index.astro", _page16],
    ["src/pages/blog/[slug].astro", _page17],
    ["src/pages/blog/index.astro", _page18],
    ["src/pages/community-service.astro", _page19],
    ["src/pages/contact.astro", _page20],
    ["src/pages/events/index.astro", _page21],
    ["src/pages/officers.astro", _page22],
    ["src/pages/index.astro", _page23]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
