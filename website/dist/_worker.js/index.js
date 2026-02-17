globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D5e-qO8O.mjs';
import { manifest } from './manifest_C_rp71Nj.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/blog/edit.astro.mjs');
const _page4 = () => import('./pages/admin/blog/new.astro.mjs');
const _page5 = () => import('./pages/admin/config.astro.mjs');
const _page6 = () => import('./pages/admin/events/edit.astro.mjs');
const _page7 = () => import('./pages/admin/events/new.astro.mjs');
const _page8 = () => import('./pages/admin/lodges/edit.astro.mjs');
const _page9 = () => import('./pages/admin/lodges/new.astro.mjs');
const _page10 = () => import('./pages/admin/login.astro.mjs');
const _page11 = () => import('./pages/admin/logout.astro.mjs');
const _page12 = () => import('./pages/admin/officers/edit.astro.mjs');
const _page13 = () => import('./pages/admin/officers/new.astro.mjs');
const _page14 = () => import('./pages/admin/pages/edit.astro.mjs');
const _page15 = () => import('./pages/admin/pages/new.astro.mjs');
const _page16 = () => import('./pages/admin/service/edit.astro.mjs');
const _page17 = () => import('./pages/admin/service/new.astro.mjs');
const _page18 = () => import('./pages/admin.astro.mjs');
const _page19 = () => import('./pages/blog/_slug_.astro.mjs');
const _page20 = () => import('./pages/blog.astro.mjs');
const _page21 = () => import('./pages/community-service.astro.mjs');
const _page22 = () => import('./pages/contact.astro.mjs');
const _page23 = () => import('./pages/events.astro.mjs');
const _page24 = () => import('./pages/grand-lodge/history.astro.mjs');
const _page25 = () => import('./pages/grand-lodge/officers.astro.mjs');
const _page26 = () => import('./pages/lodges/admin/_lodge_/announcements/edit.astro.mjs');
const _page27 = () => import('./pages/lodges/admin/_lodge_/announcements/new.astro.mjs');
const _page28 = () => import('./pages/lodges/admin/_lodge_/announcements.astro.mjs');
const _page29 = () => import('./pages/lodges/admin/_lodge_/blog/edit.astro.mjs');
const _page30 = () => import('./pages/lodges/admin/_lodge_/blog/new.astro.mjs');
const _page31 = () => import('./pages/lodges/admin/_lodge_/config.astro.mjs');
const _page32 = () => import('./pages/lodges/admin/_lodge_/events/edit.astro.mjs');
const _page33 = () => import('./pages/lodges/admin/_lodge_/events/new.astro.mjs');
const _page34 = () => import('./pages/lodges/admin/_lodge_/gallery/edit.astro.mjs');
const _page35 = () => import('./pages/lodges/admin/_lodge_/gallery/new.astro.mjs');
const _page36 = () => import('./pages/lodges/admin/_lodge_/links/edit.astro.mjs');
const _page37 = () => import('./pages/lodges/admin/_lodge_/links/new.astro.mjs');
const _page38 = () => import('./pages/lodges/admin/_lodge_/members/edit.astro.mjs');
const _page39 = () => import('./pages/lodges/admin/_lodge_/members/new.astro.mjs');
const _page40 = () => import('./pages/lodges/admin/_lodge_/members.astro.mjs');
const _page41 = () => import('./pages/lodges/admin/_lodge_/minutes/edit.astro.mjs');
const _page42 = () => import('./pages/lodges/admin/_lodge_/minutes/new.astro.mjs');
const _page43 = () => import('./pages/lodges/admin/_lodge_/minutes.astro.mjs');
const _page44 = () => import('./pages/lodges/admin/_lodge_/officers/edit.astro.mjs');
const _page45 = () => import('./pages/lodges/admin/_lodge_/officers/new.astro.mjs');
const _page46 = () => import('./pages/lodges/admin/_lodge_/pages/edit.astro.mjs');
const _page47 = () => import('./pages/lodges/admin/_lodge_/pages/new.astro.mjs');
const _page48 = () => import('./pages/lodges/admin/_lodge_/service/edit.astro.mjs');
const _page49 = () => import('./pages/lodges/admin/_lodge_/service/new.astro.mjs');
const _page50 = () => import('./pages/lodges/admin/_lodge_.astro.mjs');
const _page51 = () => import('./pages/lodges/_lodge_/about.astro.mjs');
const _page52 = () => import('./pages/lodges/_lodge_/blog/_slug_.astro.mjs');
const _page53 = () => import('./pages/lodges/_lodge_/blog.astro.mjs');
const _page54 = () => import('./pages/lodges/_lodge_/community-service.astro.mjs');
const _page55 = () => import('./pages/lodges/_lodge_/contact.astro.mjs');
const _page56 = () => import('./pages/lodges/_lodge_/events.astro.mjs');
const _page57 = () => import('./pages/lodges/_lodge_/gallery.astro.mjs');
const _page58 = () => import('./pages/lodges/_lodge_/history.astro.mjs');
const _page59 = () => import('./pages/lodges/_lodge_/links.astro.mjs');
const _page60 = () => import('./pages/lodges/_lodge_/membership.astro.mjs');
const _page61 = () => import('./pages/lodges/_lodge_/newsletter.astro.mjs');
const _page62 = () => import('./pages/lodges/_lodge_/officers.astro.mjs');
const _page63 = () => import('./pages/lodges/_lodge_/programs.astro.mjs');
const _page64 = () => import('./pages/lodges/_lodge_.astro.mjs');
const _page65 = () => import('./pages/officers.astro.mjs');
const _page66 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/blog/edit.astro", _page3],
    ["src/pages/admin/blog/new.astro", _page4],
    ["src/pages/admin/config.astro", _page5],
    ["src/pages/admin/events/edit.astro", _page6],
    ["src/pages/admin/events/new.astro", _page7],
    ["src/pages/admin/lodges/edit.astro", _page8],
    ["src/pages/admin/lodges/new.astro", _page9],
    ["src/pages/admin/login.astro", _page10],
    ["src/pages/admin/logout.ts", _page11],
    ["src/pages/admin/officers/edit.astro", _page12],
    ["src/pages/admin/officers/new.astro", _page13],
    ["src/pages/admin/pages/edit.astro", _page14],
    ["src/pages/admin/pages/new.astro", _page15],
    ["src/pages/admin/service/edit.astro", _page16],
    ["src/pages/admin/service/new.astro", _page17],
    ["src/pages/admin/index.astro", _page18],
    ["src/pages/blog/[slug].astro", _page19],
    ["src/pages/blog/index.astro", _page20],
    ["src/pages/community-service.astro", _page21],
    ["src/pages/contact.astro", _page22],
    ["src/pages/events/index.astro", _page23],
    ["src/pages/grand-lodge/history.astro", _page24],
    ["src/pages/grand-lodge/officers.astro", _page25],
    ["src/pages/lodges/admin/[lodge]/announcements/edit.astro", _page26],
    ["src/pages/lodges/admin/[lodge]/announcements/new.astro", _page27],
    ["src/pages/lodges/admin/[lodge]/announcements/index.astro", _page28],
    ["src/pages/lodges/admin/[lodge]/blog/edit.astro", _page29],
    ["src/pages/lodges/admin/[lodge]/blog/new.astro", _page30],
    ["src/pages/lodges/admin/[lodge]/config.astro", _page31],
    ["src/pages/lodges/admin/[lodge]/events/edit.astro", _page32],
    ["src/pages/lodges/admin/[lodge]/events/new.astro", _page33],
    ["src/pages/lodges/admin/[lodge]/gallery/edit.astro", _page34],
    ["src/pages/lodges/admin/[lodge]/gallery/new.astro", _page35],
    ["src/pages/lodges/admin/[lodge]/links/edit.astro", _page36],
    ["src/pages/lodges/admin/[lodge]/links/new.astro", _page37],
    ["src/pages/lodges/admin/[lodge]/members/edit.astro", _page38],
    ["src/pages/lodges/admin/[lodge]/members/new.astro", _page39],
    ["src/pages/lodges/admin/[lodge]/members/index.astro", _page40],
    ["src/pages/lodges/admin/[lodge]/minutes/edit.astro", _page41],
    ["src/pages/lodges/admin/[lodge]/minutes/new.astro", _page42],
    ["src/pages/lodges/admin/[lodge]/minutes/index.astro", _page43],
    ["src/pages/lodges/admin/[lodge]/officers/edit.astro", _page44],
    ["src/pages/lodges/admin/[lodge]/officers/new.astro", _page45],
    ["src/pages/lodges/admin/[lodge]/pages/edit.astro", _page46],
    ["src/pages/lodges/admin/[lodge]/pages/new.astro", _page47],
    ["src/pages/lodges/admin/[lodge]/service/edit.astro", _page48],
    ["src/pages/lodges/admin/[lodge]/service/new.astro", _page49],
    ["src/pages/lodges/admin/[lodge]/index.astro", _page50],
    ["src/pages/lodges/[lodge]/about.astro", _page51],
    ["src/pages/lodges/[lodge]/blog/[slug].astro", _page52],
    ["src/pages/lodges/[lodge]/blog/index.astro", _page53],
    ["src/pages/lodges/[lodge]/community-service.astro", _page54],
    ["src/pages/lodges/[lodge]/contact.astro", _page55],
    ["src/pages/lodges/[lodge]/events/index.astro", _page56],
    ["src/pages/lodges/[lodge]/gallery.astro", _page57],
    ["src/pages/lodges/[lodge]/history.astro", _page58],
    ["src/pages/lodges/[lodge]/links.astro", _page59],
    ["src/pages/lodges/[lodge]/membership.astro", _page60],
    ["src/pages/lodges/[lodge]/newsletter.astro", _page61],
    ["src/pages/lodges/[lodge]/officers.astro", _page62],
    ["src/pages/lodges/[lodge]/programs.astro", _page63],
    ["src/pages/lodges/[lodge]/index.astro", _page64],
    ["src/pages/officers.astro", _page65],
    ["src/pages/index.astro", _page66]
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
