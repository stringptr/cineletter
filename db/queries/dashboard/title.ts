import { sql } from "kysely";

import { z } from "zod";
import { withDbContext } from "@/db/context.ts";
import { titleCompleteSchema } from "@/schemas/title/base.ts";
import { generalSuccessSchema } from "@/schemas/common.ts";
import * as titleUpdateSchemas from "@/schemas/title/update.ts";

export async function completeDataGet(
  title_id: string,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleCompleteDataGet ${title_id}
      `.compile(trx),
    );

    return titleCompleteSchema.parse(result.rows[0]);
  });
}
export async function titleUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleUpdateSchema>,
) {
  titleUpdateSchemas.titleUpdateSchema.parse(input);

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

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleGenreUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleGenreUpdateSchema>,
) {
  titleUpdateSchemas.titleGenreUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleGenreUpdate
          @title_id = ${input.title_id},
          @genres_old = ${input.genres_old},
          @genres_new = ${input.genres_new}
      `.compile(trx),
    );

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleAkaUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleAkaUpdateSchema>,
) {
  titleUpdateSchemas.titleAkaUpdateSchema.parse(input);

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

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleLinkUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleLinkUpdateSchema>,
) {
  titleUpdateSchemas.titleLinkUpdateSchema.parse(input);

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

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleNetworkUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleNetworkUpdateSchema>,
) {
  titleUpdateSchemas.titleNetworkUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleNetworkUpdate
          @title_id = ${input.title_id},
          @network_id_old = ${input.network_id_old},
          @network_id_new = ${input.network_id_new}
      `.compile(trx),
    );

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleRegionUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleRegionUpdateSchema>,
) {
  titleUpdateSchemas.titleRegionUpdateSchema.parse(input);

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

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleSpokenLanguageUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleSpokenLanguageUpdateSchema>,
) {
  titleUpdateSchemas.titleSpokenLanguageUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleSpokenLanguageUpdate
          @title_id = ${input.title_id},
          @spoken_language_id_old = ${input.spoken_language_id_old},
          @spoken_language_id_new = ${input.spoken_language_id_new}
      `.compile(trx),
    );

    return generalSuccessSchema.parse(result.rows[0]);
  });
}

export async function titleLanguageUpdate(
  input: z.infer<typeof titleUpdateSchemas.titleLanguageUpdateSchema>,
) {
  titleUpdateSchemas.titleLanguageUpdateSchema.parse(input);

  return withDbContext(async (trx) => {
    const result = await trx.executeQuery(
      sql`
        EXEC APP.spTitleLanguageUpdate
          @title_id = ${input.title_id},
          @language_code_old = ${input.language_code_old},
          @language_code_new = ${input.language_code_new}
      `.compile(trx),
    );

    return generalSuccessSchema.parse(result.rows[0]);
  });
}
