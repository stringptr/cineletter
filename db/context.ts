import { cookies, headers } from "next/headers";
import { sql } from "kysely";
import * as db from "@/db/index.ts";

export default async function prepareContext() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const sessionId = cookieStore.get("session_id")?.value || null;
  const userAgent = headerStore.get("user-agent") || null;

  const forwardedFor = headerStore.get("x-forwarded-for");
  const userIp = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

  const compiled = sql`
    EXEC APP.spPrepareContext ${sessionId}, ${userIp}, ${userAgent};
    `.compile(db.guest);

  await db.guest.executeQuery(compiled);
}
