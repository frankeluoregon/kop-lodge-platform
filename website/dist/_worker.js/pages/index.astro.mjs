globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, aj as defineStyleVars, g as addAttribute, ak as renderHead, r as renderTemplate, h as createAstro } from '../chunks/astro/server_Bbl4cOtW.mjs';
import { m as getAllLodges } from '../chunks/db_io3TIJnB.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const lodges = await getAllLodges(db);
  const primary = "#252e67";
  const accent = "#f5a71c";
  const secondary = "#a91e23";
  const neutral = "#4a5072";
  const $$definedVars = defineStyleVars([{ primary, accent, secondary, neutral }]);
  return renderTemplate`<html lang="en" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Oregon Knights of Pythias – Lodge Directory</title><meta name="description" content="Oregon Knights of Pythias — Lodge Directory. Friendship, Charity, Benevolence."><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="tricolor" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span${addAttribute(`${`background:${primary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${secondary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${accent}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> </div> <header data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="header-inner" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <a href="/"${addAttribute(`${"text-decoration:none"}; ${$$definedVars}`, "style")} class="brand-group" data-astro-cid-j7pv25f6> <img src="/seal.svg" alt="KoP Seal" class="header-logo" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="brand-name" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Oregon Knights of Pythias</div> <div class="brand-sub" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Grand Domain of Oregon &middot; Lodge Directory</div> </div> </a> <a href="https://www.pythias.org" target="_blank" rel="noopener" class="ext-link" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Supreme Lodge ↗</a> </div> </header> <div class="hero" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="hero-content" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <img src="/knight.svg" alt="Knight" class="hero-logo" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <h1 data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Oregon Knights of Pythias</h1> <p class="tagline" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Friendship &middot; Charity &middot; Benevolence</p> </div> <img src="/seal.svg" alt="FCB Seal" class="hero-logo" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> </div> </div> <main data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <h2 class="section-heading" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span class="tri-accent" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/bluetri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/redtri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/yeltri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}></span>
Oregon Lodges
</h2> <p${addAttribute(`${"margin-bottom:1.25rem;font-size:.95rem;color:#555"}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6>
Select a lodge below to visit their website, view events, meet their officers, and learn about their community service.
</p> <div class="lodge-grid" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> ${lodges.map((lodge) => renderTemplate`<a${addAttribute(`/${lodge.slug}/`, "href")} class="lodge-card" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="lodge-num" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Lodge No. ${lodge.number}</div> <div class="lodge-name" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>${lodge.name.replace(` Lodge No. ${lodge.number}`, "").replace(` No. ${lodge.number}`, "")}</div> <div class="lodge-arrow" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Visit site &rarr;</div> </a>`)} </div> <div class="about-box" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <h2 class="section-heading" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span class="tri-accent" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/bluetri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/redtri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/yeltri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}></span>
About the Knights of Pythias
</h2> <p data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>
The Knights of Pythias is a non-sectarian fraternal organization founded in 1864 in Washington, D.C.
        by Justus H. Rathbone. It was the first fraternal organization to receive a charter from an Act of Congress.
</p> <p data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>
Oregon lodges are united by the ideals of <strong data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Friendship, Charity, and Benevolence</strong>,
        serving their local communities while connected through the Grand Domain of Oregon.
</p> </div> </main> <footer data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <p data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Grand Domain of Oregon &mdash; Knights of Pythias &middot;
<a href="https://www.pythias.org" target="_blank" rel="noopener" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>pythias.org</a> </p> </footer> </body></html>`;
}, "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/index.astro", void 0);

const $$file = "C:/Users/rikfrankel/kop-lodge-platform/website/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
