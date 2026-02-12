globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, h as getAllEvents } from '../chunks/db_DFm1mHTU.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const events = await getAllEvents(db);
  const levelLabel = {
    lodge: "Lodge",
    grand: "Grand Lodge",
    supreme: "Supreme Lodge"
  };
  const levelColor = {
    lodge: "var(--primary)",
    grand: "#1a6b3c",
    supreme: "#8b0000"
  };
  function fmtDate(d) {
    return (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today).reverse();
  function groupByMonth(evts) {
    const g = {};
    for (const ev of evts) {
      const key = ev.event_date.slice(0, 7);
      (g[key] ??= []).push(ev);
    }
    return g;
  }
  const upcomingByMonth = groupByMonth(upcoming);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "Events" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <h1>Events Calendar</h1> <p>Lodge, Grand Lodge, and Supreme Lodge events</p> </div> <main> <!-- Level legend --> <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem"> ${Object.entries(levelLabel).map(([lvl, label]) => renderTemplate`<span${addAttribute(`background:${levelColor[lvl]};color:#fff;padding:.25rem .7rem;border-radius:99px;font-size:.8rem;font-family:sans-serif;font-weight:600`, "style")}> ${label} </span>`)} </div> ${Object.keys(upcomingByMonth).length === 0 ? renderTemplate`<p style="color:#666;margin-bottom:2rem">No upcoming events at this time. Check back soon!</p>` : Object.entries(upcomingByMonth).map(([month, evts]) => {
    const [y, m] = month.split("-");
    const monthName = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
    return renderTemplate`<section style="margin-bottom:2rem"> <h2 class="section-heading">${monthName}</h2> <div style="display:flex;flex-direction:column;gap:.75rem"> ${evts.map((ev) => renderTemplate`<div class="card" style="flex-direction:row;align-items:flex-start;gap:1rem"> <div${addAttribute(`min-width:56px;text-align:center;background:${levelColor[ev.level]};color:#fff;border-radius:var(--radius);padding:.4rem .5rem`, "style")}> <div style="font-size:1.5rem;font-weight:bold;line-height:1">${(/* @__PURE__ */ new Date(ev.event_date + "T00:00:00")).getDate()}</div> <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:.05em">${(/* @__PURE__ */ new Date(ev.event_date + "T00:00:00")).toLocaleString("en-US", { month: "short" })}</div> </div> <div style="flex:1"> <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap"> <h3 style="font-size:1rem">${ev.title}</h3> <span${addAttribute(`font-size:.7rem;font-family:sans-serif;font-weight:700;background:${levelColor[ev.level]};color:#fff;padding:.15rem .5rem;border-radius:99px`, "style")}> ${levelLabel[ev.level]} </span> </div> <p class="meta">${fmtDate(ev.event_date)}${ev.location ? ` \xB7 ${ev.location}` : ""}</p> ${ev.description && renderTemplate`<p style="font-size:.9rem;margin-top:.25rem">${ev.description}</p>`} ${ev.url && renderTemplate`<a${addAttribute(ev.url, "href")} target="_blank" rel="noopener" style="font-size:.85rem;font-family:sans-serif">More info &rarr;</a>`} </div> </div>`)} </div> </section>`;
  })} ${past.length > 0 && renderTemplate`<details style="margin-top:1rem"> <summary style="cursor:pointer;color:var(--primary);font-family:sans-serif;font-size:.9rem;padding:.5rem 0">
Show past events (${past.length})
</summary> <div style="margin-top:1rem;display:flex;flex-direction:column;gap:.5rem;opacity:.7"> ${past.map((ev) => renderTemplate`<div class="card" style="flex-direction:row;gap:.75rem;padding:.75rem"> <div style="flex:1"> <span style="font-size:.75rem;font-family:sans-serif;text-transform:uppercase;opacity:.7">${levelLabel[ev.level]} · ${fmtDate(ev.event_date)}</span> <p style="font-weight:600">${ev.title}${ev.location ? ` \u2014 ${ev.location}` : ""}</p> </div> </div>`)} </div> </details>`} </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/events/index.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/events/index.astro";
const $$url = "/events";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
