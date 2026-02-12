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
      const slug = f.get("slug")?.toString().toLowerCase().replace(/[^a-z0-9-]/g, "-") ?? "";
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await DB.prepare(
        "INSERT INTO pages (slug,title,content,meta_description,updated_at) VALUES (?,?,?,?,?)"
      ).bind(slug, f.get("title"), f.get("content"), f.get("meta_description") || null, now).run();
      return Astro2.redirect(`/admin/pages/edit?slug=${slug}&saved=1`, 302);
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "New Page", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="row"> <div class="field"> <label>Page Title *</label> <input type="text" name="title" required> </div> <div class="field"> <label>Slug * <span class="hint">(URL path, e.g. "history")</span></label> <input type="text" name="slug" required pattern="[a-z0-9-]+"> </div> </div> <div class="field"> <label>Content * <span class="hint">(Markdown)</span></label> <textarea name="content" required></textarea> </div> <div class="field"> <label>Meta Description <span class="hint">(≤160 chars)</span></label> <input type="text" name="meta_description" maxlength="160"> </div> <div class="actions"> <button type="submit" class="btn primary">Create Page</button> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/pages/new.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/pages/new.astro";
const $$url = "/admin/pages/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
