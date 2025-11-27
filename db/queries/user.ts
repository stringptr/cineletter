import * as db from "@/db/index.ts";

export async function getByID(id: number) {
  const result = await db.guest
    .selectFrom("APP.USERS")
    .selectAll()
    .where("user_id", "=", id)
    .limit(1)
    .executeTakeFirst();

  return result;
}

export async function checkUsernameAvailability(username: string) {
  const exists = await db.guest
    .selectFrom("APP.USERS")
    .select((eb) => eb.lit(1).as("exists"))
    .where("username", "=", username.toLowerCase())
    .executeTakeFirst();

  return !exists;
}

export async function checkEmailAvailability(email: string) {
  const exists = await db.guest
    .selectFrom("APP.USERS")
    .select((eb) => eb.lit(1).as("exists"))
    .where("email", "=", email.toLowerCase())
    .executeTakeFirst();

  return !exists;
}

export async function createUser(
  id: string,
  name: string,
  hashedPassword: string,
) {
  try {
    const pool = await dbPool;
    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("name", sql.NVarChar, name)
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .query(
        "INSERT INTO Auth.[USER] (ID, Name, Password) VALUES (@id, @name, @hashedPassword);",
      );

    if (result.rowsAffected[0] === 1) {
      return { success: true, error: "" };
    } else {
      return { success: false, error: "not-created" };
    }
  } catch (err: any) {
    return { success: false, error: "error" };
  }
}

export async function createSession(
  id: string,
  expireDate: Date,
  sessionID: string,
) {
  try {
    const pool = await dbPool;
    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("sessionID", sql.Text, sessionID)
      .input("date", sql.Date, expireDate)
      .query("INSERT INTO Auth.[Session] VALUES (@id, @sessionID, @date)");

    if (result.rowsAffected[0] === 1) {
      return { success: true, error: "" };
    } else {
      return { success: false, error: "not-created" };
    }
  } catch (err: any) {
    return { success: false, error: "error" };
  }
}

export async function getUserByIDRegex(id: string) {
  const pool = await dbPool;
  const result = await pool
    .request()
    .input("id", sql.VarChar, id)
    .query("SELECT * FROM Auth.[USER] u WHERE u.ID = %@id%");

  return result;
}
