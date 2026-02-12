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
  let ev = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
  if (!ev) return Astro2.redirect("/admin", 302);
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    const f = await Astro2.request.formData();
    if (f.get("_action") === "delete") {
      await DB.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
      return Astro2.redirect("/admin", 302);
    }
    try {
      await DB.prepare(
        `UPDATE events SET title=?,event_date=?,end_date=?,level=?,description=?,location=?,url=?,published=?,updated_at=? WHERE id=?`
      ).bind(
        f.get("title"),
        f.get("event_date"),
        f.get("end_date") || null,
        f.get("level"),
        f.get("description") || null,
        f.get("location") || null,
        f.get("url") || null,
        f.get("published") === "on" ? 1 : 0,
        (/* @__PURE__ */ new Date()).toISOString(),
        id
      ).run();
      ev = await DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
      message = "Event saved.";
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Edit Event", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<form method="POST"> <div class="field"> <label>Event Title *</label> <input type="text" name="title"${addAttribute(ev.title, "value")} required> </div> <div class="row"> <div class="field"> <label>Date *</label> <input type="date" name="event_date"${addAttribute(ev.event_date.slice(0, 10), "value")} required> </div> <div class="field"> <label>End Date</label> <input type="date" name="end_date"${addAttribute(ev.end_date?.slice(0, 10) ?? "", "value")}> </div> </div> <div class="row"> <div class="field"> <label>Level *</label> <select name="level" required> ${["lodge", "grand", "supreme"].map((lvl) => renderTemplate`<option${addAttribute(lvl, "value")}${addAttribute(ev.level === lvl, "selected")}>${lvl === "lodge" ? "Lodge Event" : lvl === "grand" ? "Grand Lodge" : "Supreme Lodge"}</option>`)} </select> </div> <div class="field"> <label>Location</label> <input type="text" name="location"${addAttribute(ev.location ?? "", "value")}> </div> </div> <div class="field"> <label>Description</label> <textarea name="description" style="min-height:100px">${ev.description ?? ""}</textarea> </div> <div class="field"> <label>External URL</label> <input type="url" name="url"${addAttribute(ev.url ?? "", "value")}> </div> <div class="field checkbox-row"> <input type="checkbox" id="published" name="published"${addAttribute(ev.published === 1, "checked")}> <label for="published" style="margin:0;font-weight:400">Published</label> </div> <div class="actions"> <button type="submit" class="btn primary">Save Changes</button> <a href="/admin" class="btn secondary">Cancel</a> <input type="hidden" name="_action" value="delete"> <button type="submit" class="btn danger">Delete</button> </div></form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/events/edit.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/events/edit.astro";
const $$url = "/admin/events/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
