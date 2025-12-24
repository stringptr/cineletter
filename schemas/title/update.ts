import { z } from "zod";
import * as base_schemas from "./base.ts";

export const titleUpdateSchema = base_schemas.titleSchema;

export const titleGenreUpdateSchema = base_schemas.titleGenreSchema.omit({
  genre: true,
}).extend({
  genre_old: z.string,
  genre_new: z.string,
});

export const titleAkaUpdateSchema = base_schemas.titleAkaSchema;

export const titleLinkUpdateSchema = base_schemas.titleLinkSchema.omit({
  link: true,
  link_type: true,
}).extend({
  link_type_old: z.string(),
  link_type_new: z.string(),
  link_old: z.string(),
  link_new: z.string(),
});

export const titleNetworkUpdateSchema = base_schemas.titleNetworkSchema.omit({
  network_id: true,
}).extend({
  network_id_old: z.string().max(15),
  network_id_new: z.string().max(15),
});

export const titleRegionUpdateSchema = base_schemas.titleRegionSchema.omit({
  production_region_code: true,
  origin_region_code: true,
}).extend({
  production_region_code_old: z.string().max(4),
  origin_region_code_old: z.string().max(4),
  production_region_code_new: z.string().max(4),
  origin_region_code_new: z.string().max(4),
});

export const titleSpokenLanguageUpdateSchema = base_schemas
  .titleSpokenLanguageSchema.omit({
    spoken_language_id: true,
  }).extend({
    spoken_language_id_old: z.number().int(),
    spoken_language_id_new: z.number().int(),
  });

export const titleLanguageUpdateSchema = base_schemas.titleLanguageSchema.omit({
  language_code: true,
}).extend({
  language_code_old: z.number().int(),
  language_code_new: z.number().int(),
});

export const titleCompleteUpdateSchema = z.object({
  title: titleUpdateSchema.optional(),
  title_akas: z.array(titleAkaUpdateSchema).optional(),
  title_genres: z.array(titleGenreUpdateSchema).optional(),
  title_links: z.array(titleLinkUpdateSchema).optional(),
  title_networks: z.array(titleNetworkUpdateSchema).optional(),
  title_regions: z.array(titleRegionUpdateSchema).optional(),
  title_spoken_languages: z.array(titleSpokenLanguageUpdateSchema).optional(),
  title_languages: z.array(titleLanguageUpdateSchema).optional(),
});
