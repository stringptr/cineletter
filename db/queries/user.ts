import sql from "mssql";
import { dbPool } from "@/db/index.ts";

export async function getOneUserByID(id: string) {
  const pool = await dbPool;
  const result = await pool
    .request()
    .input("id", sql.VarChar, id)
    .query("SELECT TOP 1 * FROM Auth.[USER] u WHERE u.ID = @id");

  return result;
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
