import { sql } from "kysely";
import { z } from "zod";
import { withDbContext } from "@/db/context";

import {
  titleAkaUpdateSchema,
  titleGenreUpdateSchema,
  titleLanguageUpdateSchema,
  titleLinkUpdateSchema,
  titleNetworkUpdateSchema,
  titleRegionUpdateSchema,
  titleSpokenLanguageUpdateSchema,
  titleUpdateSchema,
} from "@/schemas/title/update";

/* -----------------------------------------------------
 * Shared helper
 * --------------------------------------------------- */

async function execAndReturnSuccess<T>(
  trx: any,
  query: ReturnType<typeof sql>,
  schema: z.ZodType<T>,
) {
  const result = await trx.executeQuery<T>(query.compile(trx));

  if (!result?.rows?.length) {
    return null;
  }

  return schema.parse(result.rows[0]);
}

/* -----------------------------------------------------
 * TITLES
 * --------------------------------------------------- */

export async function updateTitle(
  payload: z.infer<typeof titleUpdateSchema>,
) {
  const data = titleUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleUpdate
          ${data.title_id},
          ${data.title},
          ${data.original_title},
          ${data.tagline},
          ${data.overview},
          ${data.type},
          ${data.is_adult},
          ${data.popularity},
          ${data.status},
          ${data.season_number},
          ${data.episode_number},
          ${data.runtime_minute},
          ${data.start_year},
          ${data.end_year}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * TITLE AKAS
 * --------------------------------------------------- */

export async function updateTitleAka(
  payload: z.infer<typeof titleAkaUpdateSchema>,
) {
  const data = titleAkaUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleAkaUpdate
          ${data.title_id},
          ${data.ordering},
          ${data.title},
          ${data.region},
          ${data.language},
          ${data.type},
          ${data.attributes},
          ${data.is_original_title}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * GENRES
 * --------------------------------------------------- */

export async function updateTitleGenre(
  payload: z.infer<typeof titleGenreUpdateSchema>,
) {
  const data = titleGenreUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleGenreUpdate
          ${data.title_id},
          ${data.genres_old},
          ${data.genres_new}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * LINKS
 * --------------------------------------------------- */

export async function updateTitleLink(
  payload: z.infer<typeof titleLinkUpdateSchema>,
) {
  const data = titleLinkUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleLinkUpdate
          ${data.title_id},
          ${data.link_type_old},
          ${data.link_old},
          ${data.link_type_new},
          ${data.link_new}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * NETWORKS
 * --------------------------------------------------- */

export async function updateTitleNetwork(
  payload: z.infer<typeof titleNetworkUpdateSchema>,
) {
  const data = titleNetworkUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleNetworkUpdate
          ${data.title_id},
          ${data.network_id_old},
          ${data.network_id_new}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * REGIONS
 * --------------------------------------------------- */

export async function updateTitleRegion(
  payload: z.infer<typeof titleRegionUpdateSchema>,
) {
  const data = titleRegionUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleRegionUpdate
          ${data.title_id},
          ${data.production_region_code_old},
          ${data.origin_region_code_old},
          ${data.production_region_code_new},
          ${data.origin_region_code_new}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * SPOKEN LANGUAGES
 * --------------------------------------------------- */

export async function updateTitleSpokenLanguage(
  payload: z.infer<typeof titleSpokenLanguageUpdateSchema>,
) {
  const data = titleSpokenLanguageUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleSpokenLanguageUpdate
          ${data.title_id},
          ${data.spoken_language_id_old},
          ${data.spoken_language_id_new}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}

/* -----------------------------------------------------
 * LANGUAGES
 * --------------------------------------------------- */

export async function updateTitleLanguage(
  payload: z.infer<typeof titleLanguageUpdateSchema>,
) {
  const data = titleLanguageUpdateSchema.parse(payload);

  return withDbContext(async (trx) => {
    return execAndReturnSuccess(
      trx,
      sql`
        EXEC APP.spTitleLanguageUpdate
          ${data.title_id},
          ${data.language_code_old},
          ${data.language_code_new}
      `,
      z.object({
        success: z.boolean(),
        error_code: z.string().nullable(),
        message: z.string().nullable(),
      }),
    );
  });
}
