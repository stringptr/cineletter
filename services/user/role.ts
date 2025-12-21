import { sql } from "kysely";
import { z } from "zod";
import { withDbContext } from "@/db/context.ts";

export const companyRolesSchema = z.object({
  is_active: z.boolean().default(false),
  company_id: z.number(),
  company_name: z.string(),
  type: z.enum(["marketing", "executive"]),
}).nullable();

export async function company() {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
      EXEC APP.spUserRolesCompanyGet;
    `.compile(trx),
    );

    if (result !== null) {
      const data = result.rows.map((r) => companyRolesSchema.parse(r));
      return data;
    }

    return [];
  });
}

export const databaseRolesSchema = z.object({
  is_active: z.boolean().default(false),
  type: z.enum(["data", "company_roles"]),
}).nullable();

export async function database() {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
      EXEC APP.spUserRolesDatabaseGet;
    `.compile(trx),
    );

    if (result !== null) {
      const data = result.rows.map((r) => databaseRolesSchema.parse(r));
      return data;
    }

    return [];
  });
}

export async function rolesGet() {
  return withDbContext(async (trx) => {
    const [dbResult, companyResult] = await Promise.all([
      trx.executeQuery(sql`EXEC APP.spUserRolesDatabaseGet;`.compile(trx)),
      trx.executeQuery(sql`EXEC APP.spUserRolesCompanyGet;`.compile(trx)),
    ]);

    // Helper to safely parse rows and filter out failures or nulls
    const safeMap = (rows, schema) => {
      if (!rows) return [];

      return rows
        .map((r) => schema.safeParse(r))
        .filter((result) => result.success && result.data !== null)
        .map((result) => result.data);
    };

    const database = safeMap(dbResult?.rows, databaseRolesSchema);
    const company = safeMap(companyResult?.rows, companyRolesSchema);

    return { database, company };
  });
}
