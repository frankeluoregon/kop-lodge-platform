globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, c as getPublishedPosts } from '../chunks/db_DFm1mHTU.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const posts = await getPublishedPosts(db, 20);
  function fmtDate(d) {
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": "Blog" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero"> <h1>Lodge Blog</h1> <p>News, announcements, and stories from ${config.lodge_name}</p> </div> <main> ${posts.length === 0 ? renderTemplate`<p style="color:#666">No posts yet — check back soon.</p>` : renderTemplate`<div style="display:flex;flex-direction:column;gap:1.5rem"> ${posts.map((post) => renderTemplate`<article class="card" style="flex-direction:row;gap:1.25rem;align-items:flex-start"> <div style="flex:1"> <h2 style="font-size:1.2rem"> <a${addAttribute(`/blog/${post.slug}`, "href")}>${post.title}</a> </h2> ${post.published_at && renderTemplate`<p class="meta">${fmtDate(post.published_at)}${post.author ? ` \xB7 by ${post.author}` : ""}</p>`} ${post.excerpt && renderTemplate`<p style="margin-top:.5rem">${post.excerpt}</p>`} <a class="cta"${addAttribute(`/blog/${post.slug}`, "href")} style="margin-top:.75rem">Read post &rarr;</a> </div> </article>`)} </div>`} </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/blog/index.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
