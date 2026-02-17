globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, h as createAstro } from '../chunks/astro/server_Db7M_Z8T.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$CommunityService = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CommunityService;
  return Astro2.redirect("/", 302);
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/community-service.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/community-service.astro";
const $$url = "/community-service";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$CommunityService,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
