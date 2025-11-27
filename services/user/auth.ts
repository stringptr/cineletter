import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import * as userQuery from "@/db/queries/user.ts";
import * as db from "@/db/index.ts";

export async function userSignup(
  id: string,
  name: string,
  password: string,
) {
  const exist = await userQuery.getOneUserByID(id);

  if (exist.recordset.length > 0) {
    return { success: false, error: "taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const res = await userQuery.createUser(id, name, hashedPassword);
  return res;
}

export async function userLogin(
  id: string,
  password: string,
) {
  const exist = await userQuery.getOneUserByID(id);

  if (exist.recordset.length > 0) {
    return { success: false, error: "not-found" };
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    exist.output.hashedPassword,
  );

  if (!isPasswordCorrect) return ({ success: false, error: "wrong-password" });

  const expireDate = new Date(Date.now() + 1000 * 60 * 60 + 24 * 7);
  const sessionID = randomUUID();

  const res = await userQuery.createSession(id, expireDate, sessionID);
  return res;
}
