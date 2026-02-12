globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, d as getOfficers } from '../chunks/db_DFm1mHTU.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Officers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Officers;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const officers = await getOfficers(db);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "Officers" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <h1>Lodge Officers</h1> <p>${config.lodge_name}</p> </div> <main> ${officers.length === 0 ? renderTemplate`<p style="color:#666">Officer information will be posted soon.</p>` : renderTemplate`<div class="card-grid"> ${officers.map((o) => renderTemplate`<div class="card" style="align-items:center;text-align:center"> <div style="width:80px;height:80px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;margin:0 auto .5rem"> <span style="color:var(--accent);font-size:2rem;font-weight:bold">${o.name.charAt(0)}</span> </div> <h3 style="color:var(--primary)">${o.name}</h3> <p class="meta" style="font-style:italic">${o.title}</p> ${o.email && renderTemplate`<a${addAttribute(`mailto:${o.email}`, "href")} style="font-size:.85rem">${o.email}</a>`} </div>`)} </div>`} </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/officers.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/officers.astro";
const $$url = "/officers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Officers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
