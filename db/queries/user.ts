import { sql } from "kysely";
import { z } from "zod";
import * as db from "@/db/index.ts";
import { withDbContext } from "@/db/context.ts";
import { generalSuccessSchema } from "@/schemas/common.ts";

export const userSessionCreateSchema = z.object({
  success: z.boolean(),
  error_code: z.string().nullable(),
  message: z.string().nullable(),
});

export const existSchema = z.object({
  exist: z.boolean(),
  error_code: z.string().nullable(),
  type: z.enum(["username", "email"]).nullable(),
});

export async function exist(credential: string) {
  const compiled = sql`
  EXEC APP.spCredentialExist ${credential};
`.compile(db.guest);

  const result = await db.guest.executeQuery<z.infer<typeof existSchema>>(
    compiled,
  );
  const row = result.rows?.[0];

  const validated = existSchema.parse(row);
  return validated;
}

export async function signup(
  email: string,
  name: string,
  username: string,
  hashed_password: Buffer,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
      sql`
        EXEC APP.spUserSignup ${email}, ${name}, ${username}, ${hashed_password};
    `.compile(trx),
    );

    const parsed_result = generalSuccessSchema.parse(result.rows[0]);

    if (!parsed_result.success) {
      throw new Error("FAIL");
    }

    return parsed_result;
  });
}

export async function sessionCreate(
  user_id: string,
  session_id: string,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof generalSuccessSchema>>(
      sql`
        EXEC APP.spUserSessionCreate ${user_id}, ${session_id};
    `.compile(trx),
    );

    const data = generalSuccessSchema.parse(result.rows[0]);

    if (!data.success) {
      throw new Error("FAIL");
    }

    return data;
  });
}

export const authInfoSchema = z.object({
  username: z.string(),
  email: z.string(),
  user_id: z.number(),
  hashed_password: z.instanceof(Buffer),
});

export async function authInfoGet(
  credential: string,
  credential_type: string,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof authInfoSchema>>(
      sql`
      EXEC APP.spUserAuthInfoGet ${credential}, ${credential_type};
    `.compile(trx),
    );

    const data = result?.rows[0];
    const parsed_data = authInfoSchema.parse(data);

    return parsed_data;
  });
}

export const detailsSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  gender: z.string().nullable(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
});

export async function detailsGet() {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof detailsSchema>>(
      sql`EXEC APP.spUserDetailsGet`.compile(trx),
    );

    if (!result?.rows || result.rows.length === 0) {
      return null;
    }

    const data = result.rows[0];
    return detailsSchema.parse(data);
  });
}
