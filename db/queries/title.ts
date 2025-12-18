import { sql } from "kysely";

import { z } from "zod";
import * as db from "@/db/index.ts";
import prepareContext from "@/db/context.ts";

export const detailsSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable().default(null),
  original_title: z.string().nullable().default(null),
  tagline: z.string().nullable().default(null),
  overview: z.string().nullable().default(null),
  type: z.string().nullable().default(null),
  is_adult: z.boolean().nullable().default(null),
  status: z.string().nullable().default(null),
  season_number: z.number().nullable().default(null),
  episode_number: z.number().nullable().default(null),
  runtime_minute: z.number().nullable().default(null),
  start_year: z.number().nullable().default(null),
  end_year: z.number().nullable().default(null),
  popularity: z.number().nullable().default(null),
  old_rate_count: z.number().nullable().default(null),
  old_average_rating: z.number().nullable().default(null),
  rate_count: z.number().nullable().default(null),
  average_rating: z.number().nullable().default(null),

  genres: z.array(z.string()).default([]),

  production_companies: z.array(
    z.object({
      company_id: z.number(),
      company_name: z.string(),
    }),
  ).default([]),

  regions: z.array(
    z.object({
      type: z.string(),
      code: z.string(),
    }),
  ).default([]),

  languages: z.array(
    z.object({
      language_code: z.string(),
    }),
  ).default([]),

  spoken_languages: z.array(
    z.object({
      spoken_language_id: z.number(),
      spoken_language_name: z.string(),
    }),
  ).default([]),

  networks: z.array(
    z.object({
      network_id: z.number(),
      network_name: z.string(),
    }),
  ).default([]),

  links: z.array(
    z.object({
      link_type: z.string(),
      link: z.string(),
    }),
  ).default([]),
});

export async function getDetails(title_id: string) {
  const compiled = sql`
  EXEC APP.spGetTitleDetails ${title_id};
`.compile(db.guest);

  prepareContext();
  const result = await db.guest.executeQuery<{ result: string }>(compiled);
  const row = result.rows?.[0];

  if (!row || typeof row.result !== "string") {
    throw new Error("not found");
  }

  const parsedJson = JSON.parse(row.result);
  const validated = detailsSchema.parse(parsedJson);
  return validated;
}

export const searchSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable().default(null),
  rate_count: z.number().nullable().default(null),
  average_rating: z.number().nullable().default(null),
  start_year: z.number().nullable().default(null),
  type: z.string(),
  relevance: z.number().nullable().default(null),
  title_akas: z.array(
    z.object({
      title: z.string(),
    }),
  ).default([]),
});

export async function titleSearch(
  searched: string,
  page: number | null,
  page_size: number | null,
  sort_by: string | null,
  invert_sort: boolean | null,
  genre: string | null,
  type: string | null,
) {
  const compiled = sql`
  EXEC APP.spSearchTitles @title=${searched}, @page_number=${page}, @page_size=${page_size}, @sort_by=${sort_by}, @invert_sort=${invert_sort}, @genre=${genre}, @type=${type};
`.compile(db.guest);

  prepareContext();
  const result = await db.guest.executeQuery(compiled);

  const parsed = result.rows.map((r) =>
    searchSchema.parse({
      ...r,
      title_akas: JSON.parse(r.title_akas),
    })
  );

  return parsed;
}
