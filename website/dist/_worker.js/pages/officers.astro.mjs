globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, h as createAstro } from '../chunks/astro/server_CngiM2x4.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Officers = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Officers;
  return Astro2.redirect("/", 302);
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/officers.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/officers.astro";
const $$url = "/officers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Officers,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
