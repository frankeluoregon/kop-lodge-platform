globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, u as unescapeHTML } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, b as getUpcomingEvents, c as getPublishedPosts, e as getCommunityService } from '../chunks/db_DFm1mHTU.mjs';
import { r as renderMarkdown } from '../chunks/markdown_igmvQQGM.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const upcomingEvents = await getUpcomingEvents(db, void 0, 3);
  const latestPosts = await getPublishedPosts(db, 3);
  const featured = await getCommunityService(db, true, 3);
  function fmtDate(d) {
    return (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
  const levelLabel = {
    lodge: "Lodge Event",
    grand: "Grand Lodge",
    supreme: "Supreme Lodge"
  };
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="hero"> <h1>${config.lodge_name}</h1> <p>${config.tagline || "Friendship \xB7 Charity \xB7 Benevolence"}</p> ${config.founded_year && renderTemplate`<p style="margin-top:.5rem;font-size:.9rem;opacity:.7">Founded ${config.founded_year}</p>`} </div> <main> <!-- Upcoming Events --> ${upcomingEvents.length > 0 && renderTemplate`<section> <h2 class="section-heading">Upcoming Events</h2> <div class="card-grid"> ${upcomingEvents.map((ev) => renderTemplate`<div class="card"> <span class="tag">${levelLabel[ev.level] ?? ev.level}</span> <h3>${ev.title}</h3> <p class="meta">${fmtDate(ev.event_date)}${ev.location ? ` \xB7 ${ev.location}` : ""}</p> ${ev.description && renderTemplate`<p>${ev.description}</p>`} ${ev.url ? renderTemplate`<a class="cta"${addAttribute(ev.url, "href")} target="_blank" rel="noopener">Details &rarr;</a>` : renderTemplate`<a class="cta" href="/events">See All Events &rarr;</a>`} </div>`)} </div> <p><a href="/events">View full calendar &rarr;</a></p> </section>`} <!-- Featured Community Service --> ${featured.length > 0 && renderTemplate`<section style="margin-top:2.5rem"> <h2 class="section-heading">Community Service</h2> <div class="card-grid"> ${featured.map((cs) => renderTemplate`<div class="card"> <h3>${cs.title}</h3> ${cs.service_date && renderTemplate`<p class="meta">${fmtDate(cs.service_date)}</p>`} <div class="prose">${unescapeHTML(renderMarkdown(cs.description))}</div> </div>`)} </div> <p><a href="/community-service">See all service projects &rarr;</a></p> </section>`} <!-- Latest Blog Posts --> ${latestPosts.length > 0 && renderTemplate`<section style="margin-top:2.5rem"> <h2 class="section-heading">From the Blog</h2> <div class="card-grid"> ${latestPosts.map((post) => renderTemplate`<div class="card"> <h3><a${addAttribute(`/blog/${post.slug}`, "href")}>${post.title}</a></h3> ${post.published_at && renderTemplate`<p class="meta">${fmtDate(post.published_at)}${post.author ? ` \xB7 ${post.author}` : ""}</p>`} ${post.excerpt && renderTemplate`<p>${post.excerpt}</p>`} <a class="cta"${addAttribute(`/blog/${post.slug}`, "href")}>Read more &rarr;</a> </div>`)} </div> <p><a href="/blog">All posts &rarr;</a></p> </section>`} <!-- About blurb --> <section style="margin-top:2.5rem;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;box-shadow:var(--shadow)"> <h2 class="section-heading">About the Knights of Pythias</h2> <p>
The Knights of Pythias is a non-sectarian fraternal organization founded in 1864 in Washington, D.C.
        by Justus H. Rathbone. It was the first fraternal organization to receive a charter from an Act
        of Congress. Members are united by the ideals of <strong>Friendship, Charity, and Benevolence</strong>.
</p> <p style="margin-top:.75rem"><a href="/about">Learn about our lodge &rarr;</a></p> </section> </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/index.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
