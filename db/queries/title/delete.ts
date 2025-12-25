import { Kysely, sql, Transaction } from "kysely";
import { z } from "zod";
import { DATABASE } from "../../schema.ts";
import { generalSuccessSchema } from "@/schemas/common.ts";
import * as baseSchemas from "@/schemas/title/base.ts";

export async function titleDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleDelete
        ${params.title_id},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleAkaDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleAkaSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleAkaDelete
        ${params.title_id},
        ${params.ordering},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleGenreDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleGenreSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleGenreDelete
        ${params.title_id},
        ${params.genre}
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleLinkDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleLinkSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleLinkDelete
        ${params.title_id},
        ${params.link_type},
        ${params.link},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleNetworkDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleNetworkSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleNetworkDelete
        ${params.title_id},
        ${params.network_id},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleRegionDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleRegionSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleRegionDelete
        ${params.title_id},
        ${params.production_region_code},
        ${params.origin_region_code},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleSpokenLanguageDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleSpokenLanguageSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleSpokenLanguageDelete
        ${params.title_id},
        ${params.spoken_language_id},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}

export async function titleLanguageDelete(
  trx: Kysely<DATABASE>,
  params: z.infer<typeof baseSchemas.titleLanguageSchema>,
) {
  const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
    sql`
      EXEC APP.spTitleLanguageDelete
        ${params.title_id},
        ${params.language_code},
    `.compile(trx),
  );

  return generalSuccessSchema.parse(result.rows[0]);
}
