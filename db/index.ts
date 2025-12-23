import process from "node:process";
import { Kysely, MssqlDialect } from "kysely";
import * as Tedious from "tedious";
import * as Tarn from "tarn";
import { DATABASE } from "./schema.ts";

function createDialect(username: string, password: string) {
  const dialect = new MssqlDialect({
    tarn: {
      ...Tarn,
      options: {
        min: 0,
        max: 20,
        idleTimeoutMillis: 12000000,
      },
    },
    tedious: {
      ...Tedious,
      connectionFactory: () => {
        const connection = new Tedious.Connection({
          server: "localhost",
          authentication: {
            type: "default",
            options: { userName: username, password: password },
          },
          options: {
            database: "PROJECT_SMBD",
            trustServerCertificate: true,
          },
        });

        connection.on("connect", (err) => {
          if (err) {
            console.error(
              `[DB:${username}] ❌ Connection failed:`,
              err.message,
            );
          } else {
            console.log(`[DB:${username}] ✅ Connected successfully`);
          }
        });

        connection.on("end", () => {
          console.log(`[DB:${username}] 🔌 Connection closed`);
        });

        connection.on("error", (err) => {
          console.error(`[DB:${username}] ⚠️ Connection error:`, err.message);
        });

        return connection;
      },
    },
  });

  return dialect;
}

export const database = new Kysely<DATABASE>({
  dialect: createDialect(
    process.env.DB_USER!,
    process.env.DB_PWD!,
  ),
});

// export async function testConnection(db: Kysely<any>, name: string) {
//   try {
//     const compiled = sql`
//       SELECT 1 AS ok
//     `.compile(database);
//     await guest.executeQuery(compiled);
//     console.log(`[DB:${name}] ✅ Connection test passed`);
//   } catch (err: any) {
//     console.error(`[DB:${name}] ❌ Connection test failed:`, err.message);
//   }
// }
