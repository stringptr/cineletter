import Image from "next/image";

import { NoteDB } from "@/lib/note-db";

export default async function Home() {
  const result = await NoteDB.execute("SELECT * FROM USER");

  return (
    <main>
      <h1>Users</h1>
      <ul>
        {result.rows.map((user: any) => (
          <p key={user.ID}>{user.Name}</p>
        ))}
      </ul>
    </main>
  );
}
