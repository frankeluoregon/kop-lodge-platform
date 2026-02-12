globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_XPN6sfq-.mjs';
import { $ as $$AdminForm } from '../../../chunks/AdminForm_CoNl_yQ0.mjs';
import { g as getAdminToken, i as isValidAdminToken } from '../../../chunks/auth_B4Zu3cps.mjs';
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
  const id = Number(Astro2.url.searchParams.get("id"));
  if (!id) return Astro2.redirect("/admin", 302);
  let officer = await DB.prepare("SELECT * FROM officers WHERE id = ?").bind(id).first();
  if (!officer) return Astro2.redirect("/admin", 302);
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    const f = await Astro2.request.formData();
    if (f.get("_action") === "delete") {
      await DB.prepare("DELETE FROM officers WHERE id = ?").bind(id).run();
      return Astro2.redirect("/admin", 302);
    }
    try {
      await DB.prepare(
        "UPDATE officers SET title=?,name=?,email=?,display_order=?,active=?,updated_at=? WHERE id=?"
      ).bind(
        f.get("title"),
        f.get("name"),
        f.get("email") || null,
        Number(f.get("display_order") ?? 0),
        f.get("active") === "on" ? 1 : 0,
        (/* @__PURE__ */ new Date()).toISOString(),
        id
      ).run();
      officer = await DB.prepare("SELECT * FROM officers WHERE id = ?").bind(id).first();
      message = "Officer saved.";
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Edit Officer", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Officer Title *</label> <input type="text" name="title"${addAttribute(officer.title, "value")} required> </div> <div class="field"> <label>Name *</label> <input type="text" name="name"${addAttribute(officer.name, "value")} required> </div> <div class="row"> <div class="field"> <label>Email</label> <input type="email" name="email"${addAttribute(officer.email ?? "", "value")}> </div> <div class="field"> <label>Display Order</label> <input type="number" name="display_order"${addAttribute(officer.display_order, "value")} min="0"> </div> </div> <div class="field checkbox-row"> <input type="checkbox" id="active" name="active"${addAttribute(officer.active === 1, "checked")}> <label for="active" style="margin:0;font-weight:400">Active (shown on site)</label> </div> <div class="actions"> <button type="submit" class="btn primary">Save Changes</button> <a href="/admin" class="btn secondary">Cancel</a> <input type="hidden" name="_action" value="delete"> <button type="submit" class="btn danger">Remove</button> </div></form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/officers/edit.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/officers/edit.astro";
const $$url = "/admin/officers/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
