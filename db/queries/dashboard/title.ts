import { sql } from "kysely";

import { z } from "zod";
import * as db from "@/db/index.ts";
import { withDbContext } from "@/db/context.ts";

export const spResultSchema = z.object({
  success: z.boolean(),
  error_code: z.string().nullable(),
  message: z.string().nullable(),
});

export type SpResult = z.infer<typeof spResultSchema>;
export const titleUpdateSchema = z.object({
  title_id: z.string().max(15),
  title: z.string(),
  original_title: z.string(),
  tagline: z.string(),
  overview: z.string(),
  type: z.string().max(15),
  is_adult: z.boolean(),
  popularity: z.number(),
  status: z.string().max(32),
  season_number: z.number().int().nullable(),
  episode_number: z.number().int().nullable(),
  runtime_minute: z.number().int().nullable(),
  start_year: z.number().int().nullable(),
  end_year: z.number().int().nullable(),
});

export async function titleUpdate(
  input: z.infer<typeof titleUpdateSchema>,
) {
  titleUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleUpdate
          @title_id = ${input.title_id},
          @title = ${input.title},
          @original_title = ${input.original_title},
          @tagline = ${input.tagline},
          @overview = ${input.overview},
          @type = ${input.type},
          @is_adult = ${input.is_adult},
          @popularity = ${input.popularity},
          @status = ${input.status},
          @season_number = ${input.season_number},
          @episode_number = ${input.episode_number},
          @runtime_minute = ${input.runtime_minute},
          @start_year = ${input.start_year},
          @end_year = ${input.end_year}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleGenreUpdateSchema = z.object({
  title_id: z.string().max(15),
  genres_old: z.string().max(15),
  genres_new: z.string().max(15),
});

export async function titleGenreUpdate(
  input: z.infer<typeof titleGenreUpdateSchema>,
) {
  titleGenreUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleGenreUpdate
          @title_id = ${input.title_id},
          @genres_old = ${input.genres_old},
          @genres_new = ${input.genres_new}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleAkaUpdateSchema = z.object({
  title_id: z.string().max(15),
  ordering: z.number().int(),
  title: z.string(),
  region: z.string().max(4).nullable(),
  language: z.string().max(4).nullable(),
  type: z.string().max(64).nullable(),
  attributes: z.string().max(64).nullable(),
  is_original_title: z.boolean(),
});

export async function titleAkaUpdate(
  input: z.infer<typeof titleAkaUpdateSchema>,
) {
  titleAkaUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleAkaUpdate
          @title_id = ${input.title_id},
          @ordering = ${input.ordering},
          @title = ${input.title},
          @region = ${input.region},
          @language = ${input.language},
          @type = ${input.type},
          @attributes = ${input.attributes},
          @is_original_title = ${input.is_original_title}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleLinkUpdateSchema = z.object({
  title_id: z.string().max(15),
  link_type_old: z.string().max(15),
  link_old: z.string().max(480),
  link_type_new: z.string().max(15),
  link_new: z.string().max(480),
});

export async function titleLinkUpdate(
  input: z.infer<typeof titleLinkUpdateSchema>,
) {
  titleLinkUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleLinkUpdate
          @title_id = ${input.title_id},
          @link_type_old = ${input.link_type_old},
          @link_old = ${input.link_old},
          @link_type_new = ${input.link_type_new},
          @link_new = ${input.link_new}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleNetworkUpdateSchema = z.object({
  title_id: z.string().max(15),
  network_id_old: z.string().max(15),
  network_id_new: z.string().max(15),
});

export async function titleNetworkUpdate(
  input: z.infer<typeof titleNetworkUpdateSchema>,
) {
  titleNetworkUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleNetworkUpdate
          @title_id = ${input.title_id},
          @network_id_old = ${input.network_id_old},
          @network_id_new = ${input.network_id_new}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleRegionUpdateSchema = z.object({
  title_id: z.string().max(15),
  production_region_code_old: z.string().max(4),
  origin_region_code_old: z.string().max(4),
  production_region_code_new: z.string().max(4),
  origin_region_code_new: z.string().max(4),
});

export async function titleRegionUpdate(
  input: z.infer<typeof titleRegionUpdateSchema>,
) {
  titleRegionUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleRegionUpdate
          @title_id = ${input.title_id},
          @production_region_code_old = ${input.production_region_code_old},
          @origin_region_code_old = ${input.origin_region_code_old},
          @production_region_code_new = ${input.production_region_code_new},
          @origin_region_code_new = ${input.origin_region_code_new}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleSpokenLanguageUpdateSchema = z.object({
  title_id: z.string().max(15),
  spoken_language_id_old: z.number().int(),
  spoken_language_id_new: z.number().int(),
});

export async function titleSpokenLanguageUpdate(
  input: z.infer<typeof titleSpokenLanguageUpdateSchema>,
) {
  titleSpokenLanguageUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleSpokenLanguageUpdate
          @title_id = ${input.title_id},
          @spoken_language_id_old = ${input.spoken_language_id_old},
          @spoken_language_id_new = ${input.spoken_language_id_new}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}

export const titleLanguageUpdateSchema = z.object({
  title_id: z.string().max(15),
  language_code_old: z.number().int(),
  language_code_new: z.number().int(),
});

export async function titleLanguageUpdate(
  input: z.infer<typeof titleLanguageUpdateSchema>,
) {
  titleLanguageUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleLanguageUpdate
          @title_id = ${input.title_id},
          @language_code_old = ${input.language_code_old},
          @language_code_new = ${input.language_code_new}
      `.compile(trx),
    );

    return spResultSchema.parse(result.rows[0]);
  });
}
