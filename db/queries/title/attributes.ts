import withDbContext from "@/db/context.ts";
import * as schemas from "@/schemas/title/base.ts";
import {
  attributesNumberStringSchema,
  attributesStringStringSchema,
} from "@/schemas/title/base.ts";
import { database } from "@/db/index.ts";

export async function genres() {
  const result = await database
    .selectFrom("INTEGRATED.GENRES")
    .select(["genre_name"])
    .orderBy("genre_name")
    .execute();

  const parsed = result.map((r) => schemas.genreSchema.parse(r));
  return parsed;
}

export async function types() {
  const result = await database
    .selectFrom("INTEGRATED.TYPES")
    .select(["type_name"])
    .orderBy("type_name")
    .execute();

  const parsed = result.map((r) => schemas.typeSchema.parse(r));
  return parsed;
}

export async function networks() {
  const result = await database
    .selectFrom("INTEGRATED.NETWORKS")
    .select(["network_id", "network_name"])
    .orderBy("network_id")
    .execute();

  const parsed = result.map((r) => schemas.networkSchema.parse(r));
  return parsed;
}

export async function regions() {
  const result = await database
    .selectFrom("INTEGRATED.REGIONS")
    .select(["region_code", "region_name"])
    .orderBy("region_code")
    .execute();

  const parsed = result.map((r) => schemas.regionSchema.parse(r));
  return parsed;
}

export async function languages() {
  const result = await database
    .selectFrom("INTEGRATED.LANGUAGES")
    .select(["language_code"])
    .orderBy("language_code")
    .execute();

  const parsed = result.map((r) => schemas.languageSchema.parse(r));
  return parsed;
}

export async function spoken_languages() {
  const result = await database
    .selectFrom("INTEGRATED.SPOKEN_LANGUAGES")
    .select(["spoken_language_id", "spoken_language_name"])
    .orderBy("spoken_language_name")
    .execute();

  const parsed = result.map((r) => schemas.spokenLanguageSchema.parse(r));
  return parsed;
}

export async function link_types() {
  const result = await database
    .selectFrom("INTEGRATED.LINK_TYPES")
    .select(["link_type"])
    .orderBy("link_type")
    .execute();

  const parsed = result.map((r) => schemas.linkTypeSchema.parse(r));
  return parsed;
}
