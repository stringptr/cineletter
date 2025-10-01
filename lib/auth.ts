import { cookies } from "next/headers";
import { NoteDB } from "@/lib/note-db";
import { randomUUID } from "crypto";

export async function createSession(username: string) {
  const sessionID = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await NoteDB.execute({
    sql: "INSERT INTO SESSION VALUES (?, ?, ?)",
    args: [sessionID, username, expiresAt.toISOString()],
  });

  const cookieStore = await cookies();
  cookieStore.set("session", sessionID, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
