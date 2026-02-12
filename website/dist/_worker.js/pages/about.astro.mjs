globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, a as getPage } from '../chunks/db_DFm1mHTU.mjs';
import { r as renderMarkdown } from '../chunks/markdown_igmvQQGM.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const page = await getPage(db, "about");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "About Us", "description": page?.meta_description ?? void 0 }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <h1>About Us</h1> <p>${config.lodge_name} &mdash; Knights of Pythias</p> </div> <main> ${page ? renderTemplate`<article class="prose">${unescapeHTML(renderMarkdown(page.content))}</article>` : renderTemplate`<p style="color:#666">Page content coming soon.</p>`} </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/about.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
