import { sql } from "kysely";
import { z } from "zod";
import withDbContext from "@/db/context.ts";
import { companyDetailsSchema } from "@/schemas/company/main.ts";

export async function companyDetails(
  company_id: number,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof companyDetailsSchema>>(
      sql`EXEC APP.spCompanyDetails ${company_id}`
        .compile(trx),
    );

    return companyDetailsSchema.parse(result?.rows[0]);
  });
}
