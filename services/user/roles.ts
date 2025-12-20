import { sql } from "kysely";
import { z } from "zod";
import * as db from "@/db/index.ts";
import prepareContext from "@/db/context.ts";

export const detailsSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  gender: z.string().nullable(),
  description: z.string().nullable(),
  created_at: z.date(),
});

export async function detailsGet() {
  await prepareContext();
  const compiled = sql`
      EXEC APP.spUserRolesGet;
    `.compile(db.guest);

  const result = await db.guest.executeQuery<z.infer<typeof detailsSchema>>(
    compiled,
  );
  const data = result?.rows[0];
  const parsed_data = detailsSchema.parse(data);

  return parsed_data;
}
