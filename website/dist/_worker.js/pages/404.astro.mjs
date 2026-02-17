globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_CngiM2x4.mjs';
import { g as getConfig } from '../chunks/db_GWKWtEgt.mjs';
import { $ as $$Base } from '../chunks/Base_DPV4fO-Z.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db).catch(() => ({
    lodge_name: "Our Lodge",
    primary_color: "#252e67",
    accent_color: "#f5a71c",
    tagline: "",
    lodge_number: "0",
    city: "",
    state: "",
    grand_domain: "",
    meeting_schedule: "",
    meeting_location: "",
    phone: "",
    email: "",
    facebook_url: "",
    founded_year: "",
    logo_key: ""
  }));
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "Page Not Found" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"><h1>404</h1><p>Page not found.</p></div> <main style="text-align:center;padding:2rem"> <p>The page you're looking for doesn't exist.</p> <p style="margin-top:1rem"><a href="/">Return to Home</a></p> </main> ` })}`;
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/404.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
