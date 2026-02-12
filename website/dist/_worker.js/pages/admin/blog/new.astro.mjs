globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$AdminForm } from '../../../chunks/AdminForm_CoNl_yQ0.mjs';
import { g as getAdminToken, i as isValidAdminToken } from '../../../chunks/auth_B4Zu3cps.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const { DB, ADMIN_TOKEN_HASH } = Astro2.locals.runtime.env;
  const token = getAdminToken(Astro2.request);
  if (!await isValidAdminToken(token ?? "", ADMIN_TOKEN_HASH ?? "")) {
    return Astro2.redirect("/admin/login", 302);
  }
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    try {
      const f = await Astro2.request.formData();
      const title = f.get("title")?.toString() ?? "";
      const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
      const publish = f.get("published") === "on";
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await DB.prepare(
        `INSERT INTO blog_posts (slug,title,excerpt,content,author,published,published_at,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?)`
      ).bind(
        slug,
        title,
        f.get("excerpt") || null,
        f.get("content"),
        f.get("author") || null,
        publish ? 1 : 0,
        publish ? now : null,
        now,
        now
      ).run();
      return Astro2.redirect("/admin?saved=blog", 302);
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "New Blog Post", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Title *</label> <input type="text" name="title" required> </div> <div class="field"> <label>Author</label> <input type="text" name="author"> </div> <div class="field"> <label>Excerpt <span class="hint">(short summary for listings)</span></label> <textarea name="excerpt" style="min-height:70px"></textarea> </div> <div class="field"> <label>Content * <span class="hint">(Markdown supported)</span></label> <textarea name="content" required></textarea> </div> <div class="field checkbox-row"> <input type="checkbox" id="published" name="published"> <label for="published" style="margin:0;font-weight:400">Publish immediately</label> </div> <div class="actions"> <button type="submit" class="btn primary">Create Post</button> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/blog/new.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/blog/new.astro";
const $$url = "/admin/blog/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
