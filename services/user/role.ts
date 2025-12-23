import { sql } from "kysely";
import {
  companyRolesSchema,
  databaseRolesSchema,
  rolesSchema,
} from "@/schemas/user/user.ts";
import withDbContext from "@/db/context.ts";

// export async function company() {
//   return await withDbContext(async (trx) => {
//     const result = await trx.executeQuery(
//       sql`
//       EXEC APP.spUserRolesCompanyGet;
//     `.compile(trx),
//     );
//
//     if (result !== null) {
//       const data = result.rows.map((r) => companyRolesSchema.parse(r));
//       return data;
//     }
//
//     return [];
//   });
// }
//
// export async function database() {
//   return await withDbContext(async (trx) => {
//     const result = await trx.executeQuery(
//       sql`
//       EXEC APP.spUserRolesDatabaseGet;
//     `.compile(trx),
//     );
//
//     if (result !== null) {
//       const data = result.rows.map((r) => databaseRolesSchema.parse(r));
//       return data;
//     }
//
//     return [];
//   });
// }

export async function rolesGet() {
  return await withDbContext(async (trx) => {
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
