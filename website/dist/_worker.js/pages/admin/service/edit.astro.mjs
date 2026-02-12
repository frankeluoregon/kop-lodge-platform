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
  let cs = await DB.prepare("SELECT * FROM community_service WHERE id = ?").bind(id).first();
  if (!cs) return Astro2.redirect("/admin", 302);
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    const f = await Astro2.request.formData();
    if (f.get("_action") === "delete") {
      await DB.prepare("DELETE FROM community_service WHERE id = ?").bind(id).run();
      return Astro2.redirect("/admin", 302);
    }
    try {
      await DB.prepare(
        `UPDATE community_service SET title=?,description=?,service_date=?,featured=?,published=?,updated_at=? WHERE id=?`
      ).bind(
        f.get("title"),
        f.get("description"),
        f.get("service_date") || null,
        f.get("featured") === "on" ? 1 : 0,
        f.get("published") === "on" ? 1 : 0,
        (/* @__PURE__ */ new Date()).toISOString(),
        id
      ).run();
      cs = await DB.prepare("SELECT * FROM community_service WHERE id = ?").bind(id).first();
      message = "Entry saved.";
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Edit Service Entry", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Title *</label> <input type="text" name="title"${addAttribute(cs.title, "value")} required> </div> <div class="field"> <label>Service Date</label> <input type="date" name="service_date"${addAttribute(cs.service_date?.slice(0, 10) ?? "", "value")}> </div> <div class="field"> <label>Description * <span class="hint">(Markdown)</span></label> <textarea name="description" required>${cs.description}</textarea> </div> <div class="field checkbox-row"> <input type="checkbox" id="featured" name="featured"${addAttribute(cs.featured === 1, "checked")}> <label for="featured" style="margin:0;font-weight:400">Featured on homepage</label> </div> <div class="field checkbox-row"> <input type="checkbox" id="published" name="published"${addAttribute(cs.published === 1, "checked")}> <label for="published" style="margin:0;font-weight:400">Published</label> </div> <div class="actions"> <button type="submit" class="btn primary">Save Changes</button> <a href="/admin" class="btn secondary">Cancel</a> <input type="hidden" name="_action" value="delete"> <button type="submit" class="btn danger">Delete</button> </div></form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/service/edit.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/service/edit.astro";
const $$url = "/admin/service/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
