import { z } from "zod";

export const titleSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable(),
  original_title: z.string().nullable(),
  tagline: z.string().nullable(),
  overview: z.string().nullable(),
  type: z.string().nullable(),
  is_adult: z.boolean().nullable(),
  popularity: z.number().nullable(),
  status: z.string().nullable(),
  season_number: z.number().int().nullable(),
  episode_number: z.number().int().nullable(),
  runtime_minute: z.number().int().nullable(),
  start_year: z.number().int().nullable(),
  end_year: z.number().int().nullable(),
  created_at: z.coerce.date(), // ISO datetime from SQL
}).nullable();

export const titleAkaSchema = z.object({
  ordering: z.number().int(),
  title: z.string(),
  region: z.string().nullable(),
  language: z.string().nullable(),
  type: z.string().nullable(),
  attributes: z.string().nullable(),
  is_original_title: z.boolean(),
}).nullable();

export const titleGenreSchema = z.object({
  genre: z.string(),
}).nullable();

export const titleLinkSchema = z.object({
  link_type: z.string(),
  link: z.string(),
}).nullable();

export const titleNetworkSchema = z.object({
  network_id: z.string(),
}).nullable();

export const titleRegionSchema = z.object({
  production_region_code: z.string().nullable(),
  origin_region_code: z.string().nullable(),
}).nullable();

export const titleSpokenLanguageSchema = z.object({
  spoken_language_id: z.string(),
}).nullable();

export const titleLanguageSchema = z.object({
  language_code: z.string(),
}).nullable();

export const titleCompleteSchema = z.object({
  title: titleSchema,
  title_akas: z.array(titleAkaSchema).nullable(),
  title_genres: z.array(titleGenreSchema).nullable(),
  title_links: z.array(titleLinkSchema).nullable(),
  title_networks: z.array(titleNetworkSchema).nullable(),
  title_regions: z.array(titleRegionSchema).nullable(),
  title_spoken_languages: z.array(titleSpokenLanguageSchema).nullable(),
  title_languages: z.array(titleLanguageSchema).nullable(),
});

export const attributesSchema = z.array(
  z.string(),
);
