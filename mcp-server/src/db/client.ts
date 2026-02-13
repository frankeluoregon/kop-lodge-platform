/**
 * Cloudflare D1 REST API client for the MCP server.
 * Uses the Cloudflare REST API so the MCP server can run locally
 * while reading/writing to the remote D1 database.
 */

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: {
    changes: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

export class D1Client {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(
    private readonly accountId: string,
    private readonly databaseId: string,
    apiToken: string,
  ) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;
    this.headers = {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    };
  }

  async query<T = Record<string, unknown>>(
    sql: string,
    params: (string | number | null)[] = [],
  ): Promise<D1Result<T>[]> {
    const res = await fetch(`${this.baseUrl}/query`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`D1 query failed (${res.status}): ${err}`);
    }

    const json = (await res.json()) as { result: D1Result<T>[] };
    return json.result;
  }

  /** Convenience: single-statement query, returns rows. */
  async all<T = Record<string, unknown>>(
    sql: string,
    params: (string | number | null)[] = [],
  ): Promise<T[]> {
    const [result] = await this.query<T>(sql, params);
    return result.results;
  }

  /** Convenience: single-statement query, returns first row or null. */
  async first<T = Record<string, unknown>>(
    sql: string,
    params: (string | number | null)[] = [],
  ): Promise<T | null> {
    const rows = await this.all<T>(sql, params);
    return rows[0] ?? null;
  }

  /** Convenience: execute a write statement, returns meta. */
  async run(
    sql: string,
    params: (string | number | null)[] = [],
  ): Promise<D1Result["meta"]> {
    const [result] = await this.query(sql, params);
    return result.meta;
  }
}

/** Build a D1Client from environment variables. */
export function createD1Client(): D1Client {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN",
    );
  }

  return new D1Client(accountId, databaseId, apiToken);
}

/** Resolve a lodge slug to its numeric ID. Throws if not found or inactive. */
export async function getLodgeId(db: D1Client, slug: string): Promise<number> {
  const row = await db.first<{ id: number }>(
    "SELECT id FROM lodges WHERE slug = ? AND active = 1",
    [slug],
  );
  if (!row) throw new Error(`Lodge '${slug}' not found or inactive`);
  return row.id;
}
