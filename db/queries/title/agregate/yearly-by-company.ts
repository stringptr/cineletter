import { sql } from "kysely";
import { z } from "zod";
import {
  movieVsTvNumber,
  movieVsTvNumberArray,
  movieVsTvUnifiedArray,
} from "@/schemas/title/agregate.ts";
import { withDbContext } from "@/db/context.ts";

export async function movieVsTvCount(
  company_id: number = 0,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof movieVsTvNumber>>(
      sql`EXEC APP.spMovieVsTvCountYearlyByCompany ${company_id}`.compile(trx),
    );

    if (!result?.rows || result.rows.length === 0) {
      return [];
    }

    console.log(result);
    return movieVsTvNumberArray.parse(result.rows);
  });
}

export async function movieVsTvAverageRateCount(
  company_id: number = 0,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof movieVsTvNumber>>(
      sql`EXEC APP.spMovieVsTvAverageRateCountYearlyByCompany ${company_id}`
        .compile(trx),
    );

    if (!result?.rows || result.rows.length === 0) {
      return [];
    }

    return movieVsTvNumberArray.parse(result.rows);
  });
}

export async function movieVsTvSumRate(
  company_id: number = 0,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof movieVsTvNumber>>(
      sql`EXEC APP.spMovieVsTvSumRateCountYearlyByCompany ${company_id}`
        .compile(trx),
    );

    if (!result?.rows || result.rows.length === 0) {
      return [];
    }

    return movieVsTvNumberArray.parse(result.rows);
  });
}

export async function movieVsTvAverageRating(
  company_id: number = 0,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof movieVsTvNumber>>(
      sql`EXEC APP.spMovieVsTvAverageRatingYearlyByCompany ${company_id}`
        .compile(trx),
    );

    if (!result?.rows || result.rows.length === 0) {
      return [];
    }

    return movieVsTvNumberArray.parse(result.rows);
  });
}

export async function movieVsTvUnified(
  company_id: number = 0,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof movieVsTvUnifiedArray>
    >(
      sql`EXEC APP.spMovieVsTvUnified ${company_id}`.compile(
        trx,
      ),
    );

    const data = movieVsTvUnifiedArray.parse(result.rows);
    return data;
  });
}
