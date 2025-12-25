import { Kysely, sql, Transaction } from "kysely";
import { z } from "zod";
import { DATABASE } from "../../schema.ts";
import withDbContext from "@/db/context.ts";
import { generalSuccessSchema } from "@/schemas/common.ts";
import * as updateSchemas from "../../../schemas/title/update.ts";

export async function titleAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleUpdate
        ${params.title_id},
        ${params.title_new},
        ${params.original_title_new},
        ${params.tagline_new},
        ${params.overview_new},
        ${params.type_new},
        ${params.is_adult_new},
        ${params.popularity_new},
        ${params.status_new},
        ${params.season_number_new},
        ${params.episode_number_new},
        ${params.runtime_minute_new},
        ${params.start_year_new},
        ${params.end_year_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleAkaAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleAkaUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleAkaAdd
        ${params.title_id},
        ${params.title_new},
        ${params.region_new},
        ${params.language_new},
        ${params.type_new},
        ${params.attributes_new},
        ${params.is_original_title_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleGenreAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleGenreUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleGenreAdd
        ${params.title_id},
        ${params.genre_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleLinkAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleLinkUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleLinkAdd
        ${params.title_id},
        ${params.link_type_new},
        ${params.link_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleNetworkAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleNetworkUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleNetworkAdd
        ${params.title_id},
        ${params.network_id_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleRegionAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleRegionUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleRegionAdd
        ${params.title_id},
        ${params.production_region_code_new},
        ${params.origin_region_code_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleSpokenLanguageAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleSpokenLanguageUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleSpokenLanguageAdd
        ${params.title_id},
        ${params.spoken_language_id_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleLanguageAdd(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof updateSchemas.titleLanguageUpdateSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleLanguageAdd
        ${params.title_id},
        ${params.language_code_new};
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}
