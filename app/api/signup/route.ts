import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { NoteDB } from "@/lib/note-db";

export async function POST(req: Request) {
  const { username, name, password } = await req.json();

  const existing = await NoteDB.execute({
    sql: "SELECT 1 FROM USER u WHERE u.Username = ? LIMIT 1",
    args: [username],
  });

  if (existing.rows.length > 0) {
    return NextResponse.json({ success: false, error: "taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await NoteDB.execute({
    sql: "INSERT INTO USER VALUES (?,?,?, NULL, NULL, NULL)",
    args: [username, name, hashedPassword],
  });

  return NextResponse.json({ success: true });
}
