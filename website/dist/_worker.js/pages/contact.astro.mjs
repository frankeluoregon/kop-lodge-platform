globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, u as unescapeHTML, g as addAttribute } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, a as getPage } from '../chunks/db_DFm1mHTU.mjs';
import { r as renderMarkdown } from '../chunks/markdown_igmvQQGM.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Contact;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const page = await getPage(db, "contact");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "Contact" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <h1>Contact Us</h1> <p>${config.lodge_name}</p> </div> <main style="display:grid;grid-template-columns:1fr 1fr;gap:2rem"> <section> ${page ? renderTemplate`<div class="prose">${unescapeHTML(renderMarkdown(page.content))}</div>` : renderTemplate`<div class="prose"> <h2>Get in Touch</h2> <p>We welcome inquiries from the public, prospective members, and visiting knights.</p> ${config.meeting_schedule && renderTemplate`<p><strong>Meetings:</strong> ${config.meeting_schedule}</p>`} ${config.meeting_location && renderTemplate`<p><strong>Location:</strong> ${config.meeting_location}</p>`} ${config.phone && renderTemplate`<p><strong>Phone:</strong> <a${addAttribute(`tel:${config.phone}`, "href")}>${config.phone}</a></p>`} ${config.email && renderTemplate`<p><strong>Email:</strong> <a${addAttribute(`mailto:${config.email}`, "href")}>${config.email}</a></p>`} </div>`} </section> <section> <div class="card"> <h3 style="color:var(--primary)">Lodge Information</h3> ${config.lodge_name && renderTemplate`<p><strong>${config.lodge_name}</strong>${config.lodge_number && config.lodge_number !== "0" ? ` \xB7 No. ${config.lodge_number}` : ""}</p>`} ${config.state && renderTemplate`<p>Grand Domain of ${config.state}</p>`} ${config.meeting_schedule && renderTemplate`<p class="meta">${config.meeting_schedule}</p>`} ${config.meeting_location && renderTemplate`<p class="meta">${config.meeting_location}</p>`} ${config.email && renderTemplate`<p><a${addAttribute(`mailto:${config.email}`, "href")}>${config.email}</a></p>`} ${config.phone && renderTemplate`<p><a${addAttribute(`tel:${config.phone}`, "href")}>${config.phone}</a></p>`} ${config.facebook_url && renderTemplate`<a class="cta"${addAttribute(config.facebook_url, "href")} target="_blank" rel="noopener">
Visit us on Facebook
</a>`} </div> </section> </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/contact.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
