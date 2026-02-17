globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, l as defineStyleVars, g as addAttribute, n as renderHead, r as renderTemplate, h as createAstro } from '../chunks/astro/server_CngiM2x4.mjs';
import { z as getAllLodges } from '../chunks/db_C4Fow50R.mjs';
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
  const contentBg = "#ded3c3";
  const $$definedVars = defineStyleVars([{ primary, accent, secondary, neutral, contentBg }]);
  return renderTemplate`<html lang="en" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Oregon Knights of Pythias – Lodge Directory</title><meta name="description" content="Oregon Knights of Pythias — Lodge Directory. Friendship, Charity, Benevolence."><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="tricolor" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span${addAttribute(`${`background:${primary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${secondary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${accent}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> </div> <header data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="header-inner" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <a href="/"${addAttribute(`${"text-decoration:none"}; ${$$definedVars}`, "style")} class="brand-group" data-astro-cid-j7pv25f6> <img src="/seal.svg" alt="KoP Seal" class="header-logo" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="brand-name" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Oregon Knights of Pythias</div> <div class="brand-sub" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Grand Domain of Oregon &middot; Lodge Directory</div> <div class="motto" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Friendship &middot; Charity &middot; Benevolence</div> </div> </a> <nav${addAttribute(`${"display:flex;gap:.4rem;align-items:center;flex-wrap:wrap"}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6> <a href="/" class="ext-link active" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Home</a> <a href="/grand-lodge/officers" class="ext-link" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Grand Officers</a> <a href="/grand-lodge/history" class="ext-link" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>History</a> <a href="https://www.pythias.org" target="_blank" rel="noopener" class="ext-link" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Supreme Lodge ↗</a> </nav> </div> </header> <div class="tricolor" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span${addAttribute(`${`background:${primary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${secondary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${accent}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> </div> <div class="hero" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <img src="/hero.png" alt="Oregon Knights of Pythias — Friendship, Charity, Benevolence" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> </div> <div class="tricolor" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span${addAttribute(`${`background:${primary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${secondary}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> <span${addAttribute(`${`background:${accent}`}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6></span> </div> <main data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="content-box" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <h2 class="section-heading" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span class="tri-accent" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/bluetri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/redtri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/yeltri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}></span>
About the Knights of Pythias
</h2> <p data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>
The Order Knights of Pythias is a chivalric order and fraternal organization dedicated to inspiring those
        knightly virtues which elevate mankind and manifest <strong data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Friendship, Charity, and Benevolence</strong>.
        Our Order derives its name from the historical account of Damon and Pythias, two friends who mutually
        pledged their lives to each other and famously held fast to their word of honor, even to the point of death.
        Knights of Pythias the world over are inducted, initiated, and congregated in local lodges which are
        subordinate to the Grand Lodge of their state or domain, and all are under the authority of the Supreme Lodge.
</p> <p data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>
Candidates for initiation into the Order are carefully chosen and artfully initiated in secret rituals,
        wherein the carefully guarded inheritance and legacy of brotherhood and life-long friendship is shared just
        as it has been since its inception. The ritual work of our Order continues to impress and instruct all who
        witness its discipline. We thereby cultivate and foster the same chivalric principles that have enlightened
        those in our ranks for over 150 years. In traditions that trace their origins to Ancient and Classical Greece,
        to Pythagoras and his fabled Pythagorean Society, through Medieval Europe's knightly past, and finally
        arriving at our own Order, the highest thoughts of the greatest minds and hearts find safe repose and bright
        revival within the portals of our Castle Halls.
</p> </div> <div class="content-box" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <h2 class="section-heading" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <span class="tri-accent" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/bluetri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/redtri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}><img src="/yeltri.svg" alt="" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}></span>
Oregon Lodges
</h2> <p${addAttribute(`${"margin-bottom:1.25rem;font-size:.95rem;color:#555"}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6>
Select a lodge below to visit their website, view events, meet their officers, and learn about their community service.
</p> <div class="lodge-grid" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> ${lodges.map((lodge) => renderTemplate`<a${addAttribute(`/lodges/${lodge.slug}/`, "href")} class="lodge-card" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <div class="lodge-num" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Lodge No. ${lodge.number}</div> <div class="lodge-name" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>${lodge.name.replace(` Lodge No. ${lodge.number}`, "").replace(` No. ${lodge.number}`, "")}</div> <div class="lodge-arrow" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Visit site &rarr;</div> </a>`)} </div> </div> </main> <footer data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}> <p data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Grand Domain of Oregon &mdash; Knights of Pythias &middot;
<a href="https://www.pythias.org" target="_blank" rel="noopener" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>pythias.org</a> <span${addAttribute(`${"margin-left:.5rem"}; ${$$definedVars}`, "style")} data-astro-cid-j7pv25f6><a href="/admin" data-astro-cid-j7pv25f6${addAttribute($$definedVars, "style")}>Admin</a></span> </p> </footer> </body></html>`;
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
