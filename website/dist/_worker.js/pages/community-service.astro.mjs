globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, u as unescapeHTML } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, e as getCommunityService } from '../chunks/db_DFm1mHTU.mjs';
import { r as renderMarkdown } from '../chunks/markdown_igmvQQGM.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$CommunityService = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CommunityService;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const entries = await getCommunityService(db, false, 24);
  function fmtDate(d) {
    return (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "Community Service" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <h1>Community Service</h1> <p>Our lodge in action — serving ${config.city || "our community"}</p> </div> <main> ${entries.length === 0 ? renderTemplate`<p style="color:#666">Service showcase coming soon.</p>` : renderTemplate`<div class="card-grid"> ${entries.map((cs) => renderTemplate`<div class="card"${addAttribute(cs.featured ? "border-color:var(--accent);border-width:2px" : "", "style")}> ${cs.featured && renderTemplate`<span class="tag">Featured</span>`} <h3>${cs.title}</h3> ${cs.service_date && renderTemplate`<p class="meta">${fmtDate(cs.service_date)}</p>`} <div class="prose">${unescapeHTML(renderMarkdown(cs.description))}</div> </div>`)} </div>`} </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/community-service.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/community-service.astro";
const $$url = "/community-service";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CommunityService,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
