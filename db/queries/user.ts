import { sql } from "kysely";
import { z } from "zod";
import { database } from "../index.ts";
import withDbContext from "@/db/context.ts";
import { generalSuccessSchema } from "@/schemas/common.ts";
import * as schemas from "@/schemas/user/user.ts";

export async function exist(credential: string) {
  const compiled = sql`
  EXEC APP.spCredentialExist ${credential};
`.compile(database);

  const result = await database.executeQuery<
    z.infer<typeof schemas.existSchema>
  >(
    compiled,
  );
  const row = result.rows?.[0];

  const validated = schemas.existSchema.parse(row);
  return validated;
}

export async function signup(
  email: string,
  name: string,
  username: string,
  hashed_password: Buffer,
) {
  return await withDbContext(async (trx) => {
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
  return await withDbContext(async (trx) => {
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

export async function authInfoGet(
  credential: string,
  credential_type: string,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.authInfoSchema>
    >(
      sql`
      EXEC APP.spUserAuthInfoGet ${credential}, ${credential_type};
    `.compile(trx),
    );

    const data = result?.rows[0];
    const parsed_data = schemas.authInfoSchema.parse(data);

    return parsed_data;
  });
}

export async function detailsGet() {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.detailsSchema>
    >(
      sql`EXEC APP.spUserDetailsGet`.compile(trx),
    );

    if (!result?.rows || result.rows.length === 0) {
      return null;
    }

    const data = result.rows[0];
    return schemas.detailsSchema.parse(data);
  });
}
