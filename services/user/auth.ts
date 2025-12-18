import bcrypt from "bcrypt";
import { uuidv7 } from "uuidv7";
import * as user from "@/db/queries/user.ts";

export async function signup(
  email: string,
  username: string,
  name: string,
  password: string,
) {
  const email_exist = await user.exist(email);
  const username_exist = await user.exist(username);

  if (username_exist.exist && email_exist.exist) {
    throw new Error("BOTH_EXIST");
  }
  if (email_exist.exist) {
    throw new Error("EMAIL_EXIST");
  }
  if (username_exist.exist) {
    throw new Error("USERNAME_EXIST");
  }

  const res = await user.signup(email, name, username, bcrypt.hash(password));
  return res;
}

export async function login(
  credential: string,
  password: string,
) {
  const exist = await user.exist(credential);

  if (!exist.exist) {
    throw new Error("NOT_FOUND");
  }

  const auth_info = await user.authInfoGet(credential, exist.type);

  const is_password_correct = await bcrypt.compare(
    bcrypt.hash(password),
    auth_info.hashed_password,
  );

  if (!is_password_correct) {
    throw new Error("WRONG_PASSWORD");
  }

  const res = await user.sessionCreate(auth_info.user_id, uuidv7());
  return res;
}
