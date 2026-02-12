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
        "INSERT INTO officers (title, name, email, display_order) VALUES (?,?,?,?)"
      ).bind(
        f.get("title"),
        f.get("name"),
        f.get("email") || null,
        Number(f.get("display_order") ?? 0)
      ).run();
      return Astro2.redirect("/admin?saved=officer", 302);
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Add Officer", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Officer Title * <span class="hint">(e.g. Chancellor Commander)</span></label> <input type="text" name="title" required> </div> <div class="field"> <label>Name *</label> <input type="text" name="name" required> </div> <div class="row"> <div class="field"> <label>Email</label> <input type="email" name="email"> </div> <div class="field"> <label>Display Order <span class="hint">(0 = first)</span></label> <input type="number" name="display_order" value="0" min="0"> </div> </div> <div class="actions"> <button type="submit" class="btn primary">Add Officer</button> <a href="/admin" class="btn secondary">Cancel</a> </div> </form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/officers/new.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/officers/new.astro";
const $$url = "/admin/officers/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
