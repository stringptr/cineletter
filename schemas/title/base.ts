import { z } from "zod";

export const titleSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable(),
  original_title: z.string().nullable().optional(),
  tagline: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  is_adult: z.boolean().nullable(),
  popularity: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  season_number: z.number().int().nullable().optional(),
  episode_number: z.number().int().nullable().optional(),
  runtime_minute: z.number().int().nullable().optional(),
  start_year: z.number().int().nullable().optional(),
  end_year: z.number().int().nullable().optional(),
});

export const titleAkaSchema = z.object({
  title_id: z.string(),
  ordering: z.number().int(),
  title: z.string(),
  region: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  attributes: z.string().nullable().optional(),
  is_original_title: z.boolean(),
});

export const titleGenreSchema = z.object({
  title_id: z.string(),
  genre: z.string(),
});

export const titleLinkSchema = z.object({
  title_id: z.string(),
  link_type: z.string(),
  link: z.string(),
});

export const titleNetworkSchema = z.object({
  title_id: z.string(),
  network_id: z.number().int(),
});

export const titleRegionSchema = z.object({
  title_id: z.string(),
  production_region_code: z.string().nullable(),
  origin_region_code: z.string().nullable(),
});

export const titleSpokenLanguageSchema = z.object({
  title_id: z.string(),
  spoken_language_id: z.number().int(),
});

export const titleLanguageSchema = z.object({
  title_id: z.string(),
  language_code: z.string(),
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
});

export const attributesSchema = z.array(
  z.record(z.string(), z.string()),
);
