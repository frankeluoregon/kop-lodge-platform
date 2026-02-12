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
  let post = await DB.prepare("SELECT * FROM blog_posts WHERE id = ?").bind(id).first();
  if (!post) return Astro2.redirect("/admin", 302);
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    const f = await Astro2.request.formData();
    if (f.get("_action") === "delete") {
      await DB.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
      return Astro2.redirect("/admin", 302);
    }
    try {
      const publish = f.get("published") === "on";
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await DB.prepare(
        `UPDATE blog_posts SET title=?,excerpt=?,content=?,author=?,published=?,
       published_at=CASE WHEN ?=1 THEN COALESCE(published_at,?) ELSE published_at END,
       updated_at=? WHERE id=?`
      ).bind(
        f.get("title"),
        f.get("excerpt") || null,
        f.get("content"),
        f.get("author") || null,
        publish ? 1 : 0,
        publish ? 1 : 0,
        now,
        now,
        id
      ).run();
      post = await DB.prepare("SELECT * FROM blog_posts WHERE id = ?").bind(id).first();
      message = "Post saved.";
    } catch (e) {
      isError = true;
      message = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminForm", $$AdminForm, { "title": "Edit Blog Post", "backUrl": "/admin", "backLabel": "\u2190 Dashboard" }, { "default": async ($$result2) => renderTemplate`${message && renderTemplate`${maybeRenderHead()}<div${addAttribute(isError ? "error-msg" : "success-msg", "class")}>${message}</div>`}<p style="font-size:.8rem;color:#888;margin-bottom:1rem">Slug: <code>${post.slug}</code> ${post.published ? renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" style="font-size:.8rem">→ view live</a>` : "(draft)"}</p> <form method="POST"> <div class="field"> <label>Title *</label> <input type="text" name="title"${addAttribute(post.title, "value")} required> </div> <div class="field"> <label>Author</label> <input type="text" name="author"${addAttribute(post.author ?? "", "value")}> </div> <div class="field"> <label>Excerpt</label> <textarea name="excerpt" style="min-height:70px">${post.excerpt ?? ""}</textarea> </div> <div class="field"> <label>Content * <span class="hint">(Markdown)</span></label> <textarea name="content" required>${post.content}</textarea> </div> <div class="field checkbox-row"> <input type="checkbox" id="published" name="published"${addAttribute(post.published === 1, "checked")}> <label for="published" style="margin:0;font-weight:400">Published</label> </div> <div class="actions"> <button type="submit" class="btn primary">Save Changes</button> <a href="/admin" class="btn secondary">Cancel</a> <input type="hidden" name="_action" value="delete"> <button type="submit" class="btn danger">Delete</button> </div></form> ` })}`;
}, "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/blog/edit.astro", void 0);

const $$file = "C:/Users/frankel/kop-lodge-platform/website/src/pages/admin/blog/edit.astro";
const $$url = "/admin/blog/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
