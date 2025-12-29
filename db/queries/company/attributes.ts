import { sql } from "kysely";
import { database } from "@/db/index.ts";
import { z } from "zod";
import { regionSchema } from "@/schemas/title/base.ts";

export async function distinctYears(
  company_id: number | null = null,
) {
  const result = await database.executeQuery<{ years: string }[]>(
    sql`
      EXEC APP.spCompanyDistinctYears ${company_id};
    `.compile(database),
  );

  const jsonParsed = JSON.parse(result.rows[0].years);
  return jsonParsed.map((i: number) => z.number().parse(i));
}

export async function distinctGenres(
  company_id: number | null = null,
) {
  const result = await database.executeQuery<{ genres: string }[]>(
    sql`
      EXEC APP.spCompanyDistinctGenres ${company_id};
    `.compile(database),
  );

  const json = JSON.parse(result.rows[0].genres);
  const data = json.map((j: string) => z.string().parse(j));
  return data;
}

export async function distinctTypes(
  company_id: number | null = null,
) {
  const result = await database.executeQuery<{ types: string }[]>(
    sql`
      EXEC APP.spCompanyDistinctTypes ${company_id};
    `.compile(database),
  );

  const jsonParsed = JSON.parse(result.rows[0].types);
  return jsonParsed.map((i: string) => z.string().parse(i));
}

export async function distinctRegions(
  company_id: number | null = null,
) {
  const result = await database.executeQuery<z.infer<typeof regionSchema>>(
    sql`
      EXEC APP.spCompanyDistinctRegions ${company_id};
    `.compile(database),
  );

  return result.rows.map((i: string) => regionSchema.parse(i));
}
