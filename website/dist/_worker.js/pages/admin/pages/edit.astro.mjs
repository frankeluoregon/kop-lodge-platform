globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$AdminForm } from '../../../chunks/AdminForm_CoNl_yQ0.mjs';
import { g as getAdminToken, i as isValidAdminToken } from '../../../chunks/auth_B4Zu3cps.mjs';
import { a as getPage } from '../../../chunks/db_DFm1mHTU.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const { DB, ADMIN_TOKEN_HASH } = Astro2.locals.runtime.env;
  const token = getAdminToken(Astro2.request);
  if (!await isValidAdminToken(token ?? "", ADMIN_TOKEN_HASH ?? "")) {
    return Astro2.redirect("/admin/login", 302);
  }
  const slug = Astro2.url.searchParams.get("slug") ?? "";
  if (!slug) return Astro2.redirect("/admin", 302);
  let page = await getPage(DB, slug);
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    try {
      const f = await Astro2.request.formData();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await DB.prepare(
        `INSERT INTO pages (slug,title,content,meta_description,updated_at) VALUES (?,?,?,?,?)
       ON CONFLICT(slug) DO UPDATE SET title=excluded.title,content=excluded.content,
       meta_description=excluded.meta_description,updated_at=excluded.updated_at`
      ).bind(
        slug,
        f.get("title"),
        f.get("content"),
        f.get("meta_description") || null,
        now
      ).run();
      page = await getPage(DB, slug);
      message = "Page saved.";
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": `Edit Page: ${slug}`, "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Page Title *</label> <input type="text" name="title"${addAttribute(page?.title ?? "", "value")} required> </div> <div class="field"> <label>Content * <span class="hint">(Markdown supported)</span></label> <textarea name="content" required>${page?.content ?? ""}</textarea> </div> <div class="field"> <label>Meta Description <span class="hint">(≤160 chars for SEO)</span></label> <input type="text" name="meta_description"${addAttribute(page?.meta_description ?? "", "value")} maxlength="160"> </div> <div class="actions"> <button type="submit" class="btn primary">Save Page</button> <a${addAttribute(`/${slug}`, "href")} target="_blank" class="btn secondary">Preview &rarr;</a> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/pages/edit.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/pages/edit.astro";
const $$url = "/admin/pages/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
