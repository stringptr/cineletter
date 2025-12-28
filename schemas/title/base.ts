import { z } from "zod";
import * as attributes from "@db/title/attributes.ts";
import { spoken_languages } from "../../db/queries/title/attributes.ts";

export const genreSchema = z.object({
  genre_name: z.string().max(14).nonempty().nonoptional(),
});

export const typeSchema = z.object({
  type_name: z.string().max(14).nonempty().nonoptional(),
});

export const networkSchema = z.object({
  network_id: z.int().positive(),
  network_name: z.string().max(254).nonempty().nonoptional(),
});

export const languageSchema = z.object({
  language_code: z.string().max(15).nonempty().nonoptional(),
});

export const regionSchema = z.object({
  region_code: z.string().max(3).nonempty().nonoptional(),
  region_name: z.string().max(63).nonoptional().nullable(),
});

export const spokenLanguageSchema = z.object({
  spoken_language_id: z.int().positive().nonoptional(),
  spoken_language_name: z.string().max(63).nonempty().nonoptional(),
});

export const linkTypeSchema = z.object({
  link_type: z.string().max(14).nonempty().nonoptional(),
});

export const titleSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  title: z.string().nullable().optional(),
  original_title: z.string().nullable().optional(),
  tagline: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  is_adult: z.boolean().nullable().optional(),
  popularity: z.float64().nullable().optional(),
  status: z.string().nullable().optional(),
  season_number: z.int().nullable().optional(),
  episode_number: z.int().nullable().optional(),
  runtime_minute: z.int().nullable().optional(),
  start_year: z.int().nullable().optional(),
  end_year: z.int().nullable().optional(),
});

export const titleAkaSchema = z.object({
  title_id: z.string().nonempty().toLowerCase(),
  ordering: z.int().min(1),
  title: z.string().nonempty(),
  region: z.string().min(2).max(3).nullable().optional(),
  language: z.string().min(2).max(3).nullable().optional(),
  type: z.string().max(63).nullable().optional(),
  attributes: z.string().max(63).nullable().optional(),
  is_original_title: z.boolean().nonoptional(),
});

export const titleGenreSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  genre: z.string().max(15).nonempty().nonoptional(),
});

export const titleLinkSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  link_type: z.string().max(15).nonempty().nonoptional(),
  link: z.string().max(480).nonempty().nonoptional(),
});

export const titleNetworkSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  network_id: z.int().positive().nonoptional(),
});

export const titleRegionSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  production_region_code: z.string().min(1).max(3).nonempty().nonoptional(),
  origin_region_code: z.string().min(1).max(3).nonempty().nonoptional(),
});

export const titleSpokenLanguageSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  spoken_language_id: z.int().positive().nonoptional(),
});

export const titleLanguageSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  language_code: z.string().min(1).max(3).nonempty().nonoptional(),
});

export const titleProductionCompanySchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  company_id: z.int().positive().nonoptional(),
});

export const titleCrewSchema = z.object({
  title_id: z.string().min(1, "Cannot be empty.").max(
    15,
    "Cannot be more than 15 character.",
  ).nonempty().nonoptional(),
  ordering: z.int().min(1),
  person_id: z.string().max(15).nonempty().nonoptional(),
  category: z.string().max(64).nullable().optional().default(null),
  job: z.string().max(300).nullable().optional().default(null),
  character: z.string().max(500).nullable().optional().default(null),
});

export const titleCompleteSchema = z.object({
  title: titleSchema,
  title_akas: z.array(titleAkaSchema).optional(),
  title_genres: z.array(titleGenreSchema).optional(),
  title_links: z.array(titleLinkSchema).optional(),
  title_networks: z.array(titleNetworkSchema).optional(),
  title_regions: z.array(titleRegionSchema).optional(),
  title_spoken_languages: z.array(titleSpokenLanguageSchema).optional(),
  title_languages: z.array(titleLanguageSchema).optional(),
  title_production_companies: z.array(titleProductionCompanySchema)
    .optional(),
  title_crews: z.array(titleCrewSchema).optional(),
});

export const attributesStringStringSchema = z.array(
  z.record(z.string(), z.string()),
);

export const attributesNumberStringSchema = z.array(
  z.record(z.string(), z.string()),
);
