globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin/login",
      "Set-Cookie": "admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
