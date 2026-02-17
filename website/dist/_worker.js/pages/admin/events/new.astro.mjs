globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, h as createAstro } from '../../../chunks/astro/server_Db7M_Z8T.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$New = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  return Astro2.redirect("/", 302);
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/admin/events/new.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/admin/events/new.astro";
const $$url = "/admin/events/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$New,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
