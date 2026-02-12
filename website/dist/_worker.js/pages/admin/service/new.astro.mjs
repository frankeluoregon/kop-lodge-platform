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
      await DB.prepare(
        `INSERT INTO community_service (title, description, service_date, featured, published)
       VALUES (?,?,?,?,?)`
      ).bind(
        f.get("title"),
        f.get("description"),
        f.get("service_date") || null,
        f.get("featured") === "on" ? 1 : 0,
        f.get("published") === "on" ? 1 : 0
      ).run();
      return Astro2.redirect("/admin?saved=service", 302);
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Add Service Entry", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Title *</label> <input type="text" name="title" required> </div> <div class="field"> <label>Service Date</label> <input type="date" name="service_date"> </div> <div class="field"> <label>Description * <span class="hint">(Markdown supported)</span></label> <textarea name="description" required></textarea> </div> <div class="field checkbox-row"> <input type="checkbox" id="featured" name="featured"> <label for="featured" style="margin:0;font-weight:400">Featured (shown on homepage)</label> </div> <div class="field checkbox-row"> <input type="checkbox" id="published" name="published" checked> <label for="published" style="margin:0;font-weight:400">Published</label> </div> <div class="actions"> <button type="submit" class="btn primary">Add Entry</button> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/service/new.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/service/new.astro";
const $$url = "/admin/service/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
