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
    throw new Error("both-exist");
  }
  if (email_exist.exist) {
    throw new Error("email-exist");
  }
  if (username_exist.exist) {
    throw new Error("username_exist");
  }

  const hashed = bcrypt.hashSync(password, 12)
  const res = await user.signup(email, name, username, Buffer.from(hashed));
  return res;
}

export async function login(
  credential: string,
  password: string,
) {
  const exist = await user.exist(credential);

  if (!exist.exist) {
    throw new Error("not-found");
  }

  const auth_info = await user.authInfoGet(credential, exist.type);

  const is_password_correct = await bcrypt.compare(
    password,
    auth_info.hashed_password.toString("utf8"),
  );

  if (!is_password_correct) {
    throw new Error("WRONG_PASSWORD");
  }

  const session_id = uuidv7();
  const res = await user.sessionCreate(auth_info.user_id, session_id);
return {...res, ...(res.success ? { session_id } : {})};
}
