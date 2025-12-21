import { z } from "zod";

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

export const titleGenreUpdateSchema = z.object({
  title_id: z.string().max(15),
  genres_old: z.string().max(15),
  genres_new: z.string().max(15),
});

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

export const titleLinkUpdateSchema = z.object({
  title_id: z.string().max(15),
  link_type_old: z.string().max(15),
  link_old: z.string().max(480),
  link_type_new: z.string().max(15),
  link_new: z.string().max(480),
});

export const titleNetworkUpdateSchema = z.object({
  title_id: z.string().max(15),
  network_id_old: z.string().max(15),
  network_id_new: z.string().max(15),
});

export const titleRegionUpdateSchema = z.object({
  title_id: z.string().max(15),
  production_region_code_old: z.string().max(4),
  origin_region_code_old: z.string().max(4),
  production_region_code_new: z.string().max(4),
  origin_region_code_new: z.string().max(4),
});

export const titleSpokenLanguageUpdateSchema = z.object({
  title_id: z.string().max(15),
  spoken_language_id_old: z.number().int(),
  spoken_language_id_new: z.number().int(),
});

export const titleLanguageUpdateSchema = z.object({
  title_id: z.string().max(15),
  language_code_old: z.number().int(),
  language_code_new: z.number().int(),
});
