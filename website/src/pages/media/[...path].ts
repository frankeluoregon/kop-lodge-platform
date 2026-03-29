import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.path;
  if (!key) return new Response("Not found", { status: 404 });

  const env = locals.runtime.env;
  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body as ReadableStream, { headers });
};
