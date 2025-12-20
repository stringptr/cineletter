import { cookies, headers } from "next/headers";
import { sql } from "kysely";
import * as db from "@/db/index.ts";
import { Kysely } from "kysely";

export default async function prepareContext() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const sessionId = cookieStore.get("session")?.value ?? null;
  const userAgent = headerStore.get("user-agent") || null;

  const forwardedFor = headerStore.get("x-forwarded-for");
  const userIp = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

  const compiled = sql`
    EXEC APP.spPrepareContext ${sessionId}, ${userIp}, ${userAgent};
    `.compile(db.guest);

  await db.guest.executeQuery(compiled);
}

export async function withDbContext<T>(
  fn: (trx: Kysely<any>) => Promise<T>,
) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const sessionId = cookieStore.get("session")?.value ?? null;
  const userAgent = headerStore.get("user-agent") || null;
  const forwardedFor = headerStore.get("x-forwarded-for");
  const userIp = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

  // ✅ Start transaction - guarantees same connection
  return db.guest.transaction().execute(async (trx) => {
    // Set SESSION_CONTEXT on this connection
    await trx.executeQuery(
      sql`
        EXEC APP.spPrepareContext ${sessionId}, ${userIp}, ${userAgent};
      `.compile(trx),
    );

    // Execute the actual work on the same connection
    return fn(trx);
  });
}
