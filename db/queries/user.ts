import * as bcrypt from "@felix/bcrypt";
import { sql } from "kysely";
import { z } from "zod";
import * as db from "@/db/index.ts";
import prepareContext from "../context.ts";

export const existSchema = z.object({
  exist: z.boolean(),
  error_code: z.string().nullable(),
  type: z.string().nullable(),
});

export async function exist(credential: string) {
  const compiled = sql`
  EXEC APP.spCredentialExist ${credential};
`.compile(db.guest);

  const result = await db.guest.executeQuery<z.infer<typeof existSchema>>(
    compiled,
  );
  const row = result.rows?.[0];

  if (row.error_code === "NOT_FOUND") {
    throw new Error("NOT_FOUND");
  }
  if (!row) {
    throw new Error("UNKNOWN");
  }

  const validated = existSchema.parse(row);
  return validated;
}

export async function signup(
  email: string,
  name: string,
  username: string,
  hashed_password: string,
) {
}

export const sessionCreateSchema = z.object({
  success: z.boolean(),
  error_code: z.string().nullable(),
  message: z.string().nullable(),
});

export async function sessionCreate(
  user_id: string,
  session_id: string,
) {
  const compiled = sql`
      EXEC APP.UserSessionCreate ${user_id} ${session_id};
    `.compile(db.guest);

  prepareContext();
  const result = await db.guest.executeQuery<
    z.infer<typeof sessionCreateSchema>
  >(compiled);
  const parsed_result = sessionCreateSchema.parse(result.rows[0]);

  if (!parsed_result.success) {
    throw new Error("FAIL");
  }

  return parsed_result;
}

export const authInfoSchema = z.object({
  username: z.string(),
  email: z.string(),
  user_id: z.string(),
  hashed_password: z.string(),
});

export async function authInfoGet(
  credential: string,
  credential_type: string,
) {
  const compiled = sql`
      EXEC APP.spAuthInfoGet ${credential}, ${credential_type};
    `.compile(db.guest);

  const result = await db.guest.executeQuery<z.infer<typeof authInfoSchema>>(
    compiled,
  );
  const data = result?.rows[0];
  const parsed_data = authInfoSchema.parse(data);

  return parsed_data;
}
