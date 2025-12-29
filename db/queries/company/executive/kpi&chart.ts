import { sql } from "kysely";
import { z } from "zod";
import withDbContext from "@/db/context.ts";
import * as schemas from "@/schemas/company/main.ts";

export async function genreRating(
  company_id: number | null = null,
  year: number | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year, region, type);
    const result = await trx.executeQuery<
      z.infer<typeof schemas.companyGenreRatingSchema>
    >(
      sql`EXEC APP.spCompanyExecutiveGenres ${company_id}, ${year}, ${region}, ${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.companyGenreRatingSchema.parse(r)
    );

    return parsed;
  });
}

export async function titleSuccess(
  company_id: number | null = null,
  year: number | null = null,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year, genre, type);
    const result = await trx.executeQuery<
      z.infer<typeof schemas.companyTitleSuccessSchema>
    >(
      sql`EXEC APP.spCompanyExecutiveTitleSuccess ${company_id}, ${year}, ${genre}, ${region}, ${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.companyTitleSuccessSchema.parse(r)
    );

    return parsed;
  });
}

export async function topCompaniesRatingRateCount(
  num: number = 5,
  year: number | null = null,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
  sort_by: string | null = "rate_count",
) {
  return await withDbContext(async (trx) => {
    console.log(num, year, genre, region, sort_by);
    const result = await trx.executeQuery<
      z.infer<typeof schemas.topCompaniesRatingRateCountSchema>
    >(
      sql`EXEC APP.spTopCompaniesRatingRateCount ${num}, ${year}, ${genre}, ${region}, ${type}, ${sort_by}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.topCompaniesRatingRateCountSchema.parse(r)
    );

    return parsed;
  });
}

export async function topCompaniesProduction(
  num: number = 5,
  year: number | null = null,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.topCompaniesProductionSchema>
    >(
      sql`EXEC APP.spTopCompaniesProduction @num=${num}, @year=${year}, @genre=${genre}, @region=${region}, @type=${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.topCompaniesProductionSchema.parse(r)
    );

    return parsed;
  });
}

export async function companyYearlyPerformance(
  company_id: number | null = null,
  year_back: number | null = 10,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year_back, genre, region, type);
    const result = await trx.executeQuery<
      z.infer<typeof schemas.companyYearlyPerformanceSchema>
    >(
      sql`EXEC APP.spCompanyExecutiveYearlyPerformance ${company_id}, ${year_back}, ${genre}, ${region}, ${type}`
        .compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.companyYearlyPerformanceSchema.parse(r)
    );

    return parsed;
  });
}

export async function companyTotalProduction(
  company_id: number | null = null,
  year: number | null = null,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year, genre, region, type);
    const result = await trx.executeQuery<
      { rows: { title_count: number }[] }
    >(
      sql`EXEC APP.spCompanyExecutiveTotalProduction ${company_id}, ${year}, ${genre}, ${region}, ${type}`
        .compile(trx),
    );

    const parsed = z.int().nullable().optional().parse(
      result?.rows?.[0].title_count,
    );

    return parsed;
  });
}

export async function companyAverageRating(
  company_id: number | null = null,
  year: number | null = null,
  genre: string | null = null,
  region: string | null = null,
  type: string | null = null,
) {
  return await withDbContext(async (trx) => {
    console.log(company_id, year, genre, region, type);
    const result = await trx.executeQuery<
      { rows: { title_count: number }[] }
    >(
      sql`EXEC APP.spCompanyExecutiveAverageRating ${company_id}, ${year}, ${genre}, ${region}, ${type}`
        .compile(trx),
    );

    const parsed = z.float64().nullable().optional().parse(
      result?.rows?.[0].average_rating,
    );

    return parsed;
  });
}
