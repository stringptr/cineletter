import { z, ZodRawShape } from "zod";

import * as base_schemas from "./base.ts";

function withOldNewExcept<T extends ZodRawShape>(
  shape: T,
  with_add_delete: boolean = false,
  blacklist: readonly (keyof T)[] = ["title_id"],
) {
  const result: ZodRawShape = {};

  for (const key in shape) {
    if (blacklist.includes(key)) continue;
    result[`${key}_new`] = shape[key];
  }

  if (!with_add_delete) {
    return z.object(result);
  }

  return z.object(result).extend({
    will_be_deleted: z.boolean().optional().default(false),
    will_be_added: z.boolean().optional().default(false),
  });
}

export const titleUpdateSchema = withOldNewExcept(
  base_schemas.titleSchema.shape,
);

export const titleGenreUpdateSchema = withOldNewExcept(
  base_schemas.titleGenreSchema.shape,
  true,
);

export const titleAkaUpdateSchema = withOldNewExcept(
  base_schemas.titleAkaSchema.shape,
  true,
);

export const titleLinkUpdateSchema = withOldNewExcept(
  base_schemas.titleLinkSchema.shape,
  true,
);

export const titleNetworkUpdateSchema = withOldNewExcept(
  base_schemas.titleNetworkSchema.shape,
  true,
);

export const titleRegionUpdateSchema = withOldNewExcept(
  base_schemas.titleRegionSchema.shape,
  true,
);

export const titleSpokenLanguageUpdateSchema = withOldNewExcept(
  base_schemas.titleSpokenLanguageSchema.shape,
  true,
);

export const titleLanguageUpdateSchema = withOldNewExcept(
  base_schemas.titleLanguageSchema.shape,
  true,
);

export const titleCrewUpdateSchema = withOldNewExcept(
  base_schemas.titleCrewSchema.shape,
  true,
);

export const titleProductionCompanyUpdateSchema = withOldNewExcept(
  base_schemas.titleProductionCompanySchema.shape,
  true,
);

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
