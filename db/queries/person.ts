import { z } from "zod";
import withDbContext from "../context.ts";
import { database } from "@/db/index.ts";
import { sql } from "kysely";
import * as personSchema from "@/schemas/person/main.ts";

export const personMovieSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  average_rating: z.number().nullable().optional(),
});

export const personDetailSchema = z.object({
  person_id: z.string().max(15).nonempty().nonoptional(),
  person_name: z.string().nullable().optional(),
  birth_year: z.number().nullable().optional(),
  death_year: z.number().nullable().optional(),

  primary_professions: z.array(
    z.object({
      primary_profession: z.string().nonempty().nonoptional(),
    }),
  ).optional().nullable(),

  top_genres: z.array(
    z.object({
      genre: z.string().nonempty().nonoptional(),
      count: z.int().positive().nonoptional(),
    }),
  ).nullable().optional(),

  movies: z.array(personMovieSchema).nullable().optional(),
});

export async function getPersonDetails(person_id: string) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof personDetailSchema>
    >(
      sql`
        EXEC APP.spGetPersonDetails ${person_id};
      `.compile(trx),
    );

    console.log(person_id);
    console.log(result);
    const row = result.rows?.[0];

    if (!row || typeof (row as any).result !== "string") {
      throw new Error("not found");
    }

    const parsedJson = JSON.parse((row as any).result);
    const validated = personDetailSchema.parse(parsedJson);

    return validated;
  });
}

export async function personExplore(
  primary_profession: string | null = null,
  sort_by: string = "relevance",
  invert_sort: boolean = false,
  page_number: number = 1,
  page_size: number | null = 20,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof personSchema.personExploreSchema>
    >(
      sql`
        EXEC APP.spPersonExplore
          @primary_profession=${primary_profession},
          @page_number=${page_number},
          @page_size=${page_size},
          @sort_by=${sort_by},
          @invert_sort=${invert_sort ? 1 : 0}
      `.compile(trx),
    );
    const row = result.rows;

    const parsedRow = row.map((r) =>
      r = { ...r, primary_professions: JSON.parse(r.primary_professions) }
    );
    const validated = parsedRow.map((p) =>
      personSchema.personExploreSchema.parse(p)
    );

    return validated;
  });
}

export async function personSearch(
  search: string | null = null,
  primary_profession: string | null = null,
  sort_by: string | null = "relevance",
  invert_sort: boolean = false,
  page_number: number = 1,
  page_size: number = 24,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof personSchema.personExploreSchema>
    >(
      sql`
        EXEC APP.spPersonSearch
          @search=${search},
          @primary_profession=${primary_profession},
          @page_number=${page_number},
          @page_size=${page_size},
          @sort_by=${sort_by},
          @invert_sort=${invert_sort}
      `.compile(trx),
    );
    const row = result.rows;

    const parsedRow = row.map((r) =>
      r = { ...r, primary_professions: JSON.parse(r.primary_professions) }
    );
    const validated = parsedRow.map((p) =>
      personSchema.personExploreSchema.parse(p)
    );

    return validated;
  });
}

export async function primary_professions() {
  const result = await database
    .selectFrom("INTEGRATED.PERSON_PRIMARY_PROFESSIONS")
    .select(["primary_profession"])
    .orderBy("primary_profession")
    .distinct()
    .execute();

  const parsed = z.array(z.object({ primary_profession: z.string() })).parse(
    result,
  );
  return parsed;
}
