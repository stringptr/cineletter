import { sql } from "kysely";
import { z } from "zod";
import * as db from "@/db/index.ts";
import prepareContext from "@/db/context.ts";

export const detailsSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable(),
  original_title: z.string().nullable(),
  tagline: z.string().nullable(),
  overview: z.string().nullable(),
  type: z.string().nullable(),
  is_adult: z.boolean().nullable(),
  status: z.string().nullable(),
  season_number: z.number().nullable(),
  episode_number: z.number().nullable(),
  runtime_minute: z.number().nullable(),
  start_year: z.number().nullable(),
  end_year: z.number().nullable(),
  popularity: z.number().nullable(),
  old_rate_count: z.number().nullable(),
  old_average_rating: z.number().nullable(),
  rate_count: z.number().nullable(),
  average_rating: z.number().nullable(),

  genres: z.array(z.string()).default([]),

  production_companies: z.array(
    z.object({
      company_id: z.string(),
      company_name: z.string(),
    }),
  )
    .default([]),

  regions: z.array(
    z.object({
      type: z.string(),
      code: z.string(),
    }),
  )
    .default([]),

  languages: z.array(
    z.object({
      language_code: z.string(),
    }),
  )
    .default([]),

  spoken_languages: z.array(
    z.object({
      spoken_language_id: z.string(),
    }),
  )
    .default([]),

  networks: z.array(
    z.object({
      network_id: z.number(),
      network_name: z.string(),
    }),
  )
    .default([]),

  links: z.array(
    z.object({
      link_type: z.string(),
      link: z.string(),
    }),
  )
    .default([]),
});

export async function getDetails(
  title_id: string,
) {
  const compiled = sql`
    EXEC APP.spGetTitleDetails ${title_id};
  `.compile(db.guest);

  // prepareContext();
  const result = await db.guest.executeQuery(compiled);
  const parsed = detailsSchema.parse(result.rows?.[0] ?? {});

  return parsed;
}
