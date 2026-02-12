globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, u as unescapeHTML } from '../../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$Base } from '../../chunks/Base_DDOoMIVA.mjs';
import { g as getConfig, f as getBlogPost } from '../../chunks/db_DFm1mHTU.mjs';
import { r as renderMarkdown } from '../../chunks/markdown_igmvQQGM.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const db = Astro2.locals.runtime.env.DB;
  const config = await getConfig(db);
  const post = slug ? await getBlogPost(db, slug) : null;
  if (!post) {
    return Astro2.redirect("/blog", 302);
  }
  function fmtDate(d) {
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": post.title, "description": post.excerpt ?? void 0 }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hero" style="padding:2rem 1.5rem"> <h1 style="font-size:1.8rem">${post.title}</h1> ${post.published_at && renderTemplate`<p style="margin-top:.5rem;font-size:.9rem;opacity:.8"> ${fmtDate(post.published_at)}${post.author ? ` \xB7 by ${post.author}` : ""} </p>`} </div> <main> <a href="/blog" style="font-family:sans-serif;font-size:.85rem;display:inline-block;margin-bottom:1.5rem">&larr; Back to Blog</a> <article class="prose">${unescapeHTML(renderMarkdown(post.content))}</article> </main> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/blog/[slug].astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
