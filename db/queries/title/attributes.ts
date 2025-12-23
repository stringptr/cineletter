import withDbContext from "@/db/context.ts";
import { attributesSchema } from "@/schemas/title/base.ts";
import { database } from "@/db/index.ts";

export async function genres() {
  const result = await database
    .selectFrom("INTEGRATED.GENRES")
    .select(["genre_name"])
    .orderBy("genre_name")
    .execute();

  const parsed = attributesSchema.parse(result);
  return parsed;
}

export async function types() {
  const result = await database
    .selectFrom("INTEGRATED.TYPES")
    .select(["type_name"])
    .orderBy("type_name")
    .execute();

  const parsed = attributesSchema.parse(result);
  return parsed;
}

