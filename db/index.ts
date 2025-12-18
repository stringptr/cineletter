import process from "node:process";
import { Kysely, MssqlDialect, sql } from "kysely";
import * as Tedious from "tedious";
import * as Tarn from "tarn";
import { DATABASE } from "./schema.ts";

async function createDialect(username: string, password: string) {
  const dialect = new MssqlDialect({
    tarn: {
      ...Tarn,
      options: {
        min: 0,
        max: 20,
        idleTimeoutMillis: 120000,
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

export const superAdmin = new Kysely<DATABASE>({
  dialect: await createDialect(
    process.env.SUPERADMIN_USER!,
    process.env.SUPERADMIN_PWD!,
  ),
});

export const admin = new Kysely<DATABASE>({
  dialect: await createDialect(
    process.env.ADMIN_USER!,
    process.env.ADMIN_PWD!,
  ),
});

export const user = new Kysely<DATABASE>({
  dialect: await createDialect(
    process.env.USER_USER!,
    process.env.USER_PWD!,
  ),
});

export const guest = new Kysely<DATABASE>({
  dialect: await createDialect(
    process.env.GUEST_USER!,
    process.env.GUEST_PWD!,
  ),
});

export async function testConnection(db: Kysely<any>, name: string) {
  try {
    const compiled = sql`
      SELECT 1 AS ok
    `.compile(guest);
    await guest.executeQuery(compiled);
    console.log(`[DB:${name}] ✅ Connection test passed`);
  } catch (err: any) {
    console.error(`[DB:${name}] ❌ Connection test failed:`, err.message);
  }
}
