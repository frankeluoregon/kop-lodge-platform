globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, h as createAstro } from '../../../chunks/astro/server_BIT25mF3.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Edit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  return Astro2.redirect("/", 302);
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/admin/pages/edit.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/admin/pages/edit.astro";
const $$url = "/admin/pages/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Edit,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
