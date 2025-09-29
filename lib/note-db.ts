import { createClient } from "@libsql/client";

export const NoteDB = createClient({
  url: process.env.NOTE_TURSO_DATABASE_URL!,
  authToken: process.env.NOTE_TURSO_AUTH_TOKEN!,
});
