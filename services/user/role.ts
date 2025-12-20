import { sql } from "kysely";
import { z } from "zod";
import * as db from "@/db/index.ts";
import prepareContext from "@/db/context.ts";

export const companySchema = z.object({
  is_active: z.boolean().default(false),
  company_id: z.number(),
  type: z.enum(["marketing", "executive"]),
}).nullable();

export async function company() {
  await prepareContext();
  const compiled = sql`
      EXEC APP.spUserRolesCompanyGet;
    `.compile(db.guest);

  const result = await db.guest.executeQuery<z.infer<typeof companySchema>>(
    compiled,
  );

  if (result.length >= 1) {
    const data = result.rows.map((r) => companySchema.parse(r));
    return data;
  }

  return [];
}
