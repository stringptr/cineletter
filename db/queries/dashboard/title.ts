import { sql } from "kysely";

import { z } from "zod";
import * as db from "@/db/index.ts";
import prepareContext from "@/db/context.ts";

const genreSchema = z.object({
  genre: z.string(),
  title_count: z.number(),
  total_rate: z.number(),
  average_rating: z.float64(),
});

export async function genre() {
  const compiled = sql`
  EXEC APP.spGetTitleDetails ${title_id};
`.compile(db.guest);

  prepareContext();
  const result = await db.guest.executeQuery<z.infer<typeof genreSchema>>(
    compiled,
  );
  const validated = result.rows.map((r) => genreSchema.parse(r));

  return validated;
}

const genreYearSchema = z.object({
  ...genreSchema,
  year: z.number(),
});

export async function genreYear() {
  const compiled = sql`
  EXEC APP.spGetTitleDetails ${title_id};
`.compile(db.guest);

  prepareContext();
  const result = await db.guest.executeQuery<z.infer<typeof genreYearSchema>>(
    compiled,
  );
  const validated = result.rows.map((r) => genreYearSchema.parse(r));

  return validated;
}
