/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

type D1Database = import("@cloudflare/workers-types").D1Database;
type R2Bucket = import("@cloudflare/workers-types").R2Bucket;

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: D1Database;
        MEDIA: R2Bucket;
        CF_ACCESS_TEAM_NAME: string;
        MEDIA_PUBLIC_URL: string;
      };
    };
  }
}
