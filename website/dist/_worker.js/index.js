globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bljnx0ag.mjs';
import { manifest } from './manifest_BSzRIt6E.mjs';

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
const _page17 = () => import('./pages/auth/callback.astro.mjs');
const _page18 = () => import('./pages/auth/login.astro.mjs');
const _page19 = () => import('./pages/auth/logout.astro.mjs');
const _page20 = () => import('./pages/blog/_slug_.astro.mjs');
const _page21 = () => import('./pages/blog.astro.mjs');
const _page22 = () => import('./pages/community-service.astro.mjs');
const _page23 = () => import('./pages/contact.astro.mjs');
const _page24 = () => import('./pages/events.astro.mjs');
const _page25 = () => import('./pages/officers.astro.mjs');
const _page26 = () => import('./pages/_lodge_/about.astro.mjs');
const _page27 = () => import('./pages/_lodge_/admin/blog/edit.astro.mjs');
const _page28 = () => import('./pages/_lodge_/admin/blog/new.astro.mjs');
const _page29 = () => import('./pages/_lodge_/admin/config.astro.mjs');
const _page30 = () => import('./pages/_lodge_/admin/events/edit.astro.mjs');
const _page31 = () => import('./pages/_lodge_/admin/events/new.astro.mjs');
const _page32 = () => import('./pages/_lodge_/admin/officers/edit.astro.mjs');
const _page33 = () => import('./pages/_lodge_/admin/officers/new.astro.mjs');
const _page34 = () => import('./pages/_lodge_/admin/pages/edit.astro.mjs');
const _page35 = () => import('./pages/_lodge_/admin/pages/new.astro.mjs');
const _page36 = () => import('./pages/_lodge_/admin/service/edit.astro.mjs');
const _page37 = () => import('./pages/_lodge_/admin/service/new.astro.mjs');
const _page38 = () => import('./pages/_lodge_/admin.astro.mjs');
const _page39 = () => import('./pages/_lodge_/blog/_slug_.astro.mjs');
const _page40 = () => import('./pages/_lodge_/blog.astro.mjs');
const _page41 = () => import('./pages/_lodge_/community-service.astro.mjs');
const _page42 = () => import('./pages/_lodge_/contact.astro.mjs');
const _page43 = () => import('./pages/_lodge_/events.astro.mjs');
const _page44 = () => import('./pages/_lodge_/officers.astro.mjs');
const _page45 = () => import('./pages/_lodge_.astro.mjs');
const _page46 = () => import('./pages/index.astro.mjs');
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
    ["src/pages/auth/callback.ts", _page17],
    ["src/pages/auth/login.ts", _page18],
    ["src/pages/auth/logout.ts", _page19],
    ["src/pages/blog/[slug].astro", _page20],
    ["src/pages/blog/index.astro", _page21],
    ["src/pages/community-service.astro", _page22],
    ["src/pages/contact.astro", _page23],
    ["src/pages/events/index.astro", _page24],
    ["src/pages/officers.astro", _page25],
    ["src/pages/[lodge]/about.astro", _page26],
    ["src/pages/[lodge]/admin/blog/edit.astro", _page27],
    ["src/pages/[lodge]/admin/blog/new.astro", _page28],
    ["src/pages/[lodge]/admin/config.astro", _page29],
    ["src/pages/[lodge]/admin/events/edit.astro", _page30],
    ["src/pages/[lodge]/admin/events/new.astro", _page31],
    ["src/pages/[lodge]/admin/officers/edit.astro", _page32],
    ["src/pages/[lodge]/admin/officers/new.astro", _page33],
    ["src/pages/[lodge]/admin/pages/edit.astro", _page34],
    ["src/pages/[lodge]/admin/pages/new.astro", _page35],
    ["src/pages/[lodge]/admin/service/edit.astro", _page36],
    ["src/pages/[lodge]/admin/service/new.astro", _page37],
    ["src/pages/[lodge]/admin/index.astro", _page38],
    ["src/pages/[lodge]/blog/[slug].astro", _page39],
    ["src/pages/[lodge]/blog/index.astro", _page40],
    ["src/pages/[lodge]/community-service.astro", _page41],
    ["src/pages/[lodge]/contact.astro", _page42],
    ["src/pages/[lodge]/events/index.astro", _page43],
    ["src/pages/[lodge]/officers.astro", _page44],
    ["src/pages/[lodge]/index.astro", _page45],
    ["src/pages/index.astro", _page46]
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
