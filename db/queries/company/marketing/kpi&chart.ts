import { sql } from "kysely";
import { z } from "zod";
import withDbContext from "@/db/context.ts";
import * as schemas from "@/schemas/company/main.ts";

export async function languageTitleCount(
  company_id: number | null = null,
  year: number | null = null,
  genre: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.companyLanguageSchema>
    >(
      sql`EXEC APP.spCompanyMarketingLanguages ${company_id}, ${year}, ${genre}, ${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.companyLanguageSchema.parse(r)
    );

    return parsed;
  });
}

export async function regionRating(
  company_id: number | null = null,
  year: number | null = null,
  genre: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year, genre, type);
    const result = await trx.executeQuery<
      z.infer<typeof schemas.companyCountryRatingSchema>
    >(
      sql`EXEC APP.spCompanyMarketingRegionRatings ${company_id}, ${year}, ${genre}, ${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.companyCountryRatingSchema.parse(r)
    );

    return parsed;
  });
}

export async function titleRatingBins(
  company_id: number | null = null,
  year: number | null = null,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year, genre, type);
    const result = await trx.executeQuery<
      z.infer<typeof schemas.companyTitleRatingBinsSchema>
    >(
      sql`EXEC APP.spCompanyMarketingTitleRatingBins ${company_id}, ${year}, ${genre}, ${region}, ${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.companyTitleRatingBinsSchema.parse(r)
    );

    return parsed;
  });
}
