import { tmdb } from "@/services/tmdb.ts";
import { title } from "@/services/tmdb_title.ts";
import { sql } from "kysely";
import * as db from "@/db/index.ts";

export async function getPaged(offset: number, limit: number = 20) {
  const compiled = sql`
    EXEC ADDITIONAL.spGetAllTitleIdNoFinancial
    @source='imdb'
  `.compile(db.guest);

  const result = await db.guest.executeQuery(compiled);
  return result?.rows?.map((r: any) => r?.title_id);
}

export async function scrapFinancial(title_id: string) {
  const tmdb_id = await tmdb.idFromImdb(title_id, "movie");

  let budget = 0;
  let revenue = 0;

  if (tmdb_id !== null && tmdb_id !== undefined) {
    const data = await title.details(tmdb_id);
    budget = data.budget ?? 0;
    revenue = data.revenue ?? 0;
  }

  try {
    const compiled = sql`
      EXEC ADDITIONAL.spInsertTitleFinancial
      @title_id=${title_id},
      @budget=${budget},
      @revenue=${revenue}
    `.compile(db.guest);

    await db.guest.executeQuery(compiled);
    if (tmdb_id === null || tmdb_id === undefined) {
      console.log(
        `failed: @title_id=${title_id}, @budget=${budget}, @revenue=${revenue}`,
      );
      return false;
    }

    console.log(
      `success: @title_id=${title_id}, @budget=${budget}, @revenue=${revenue}`,
    );
    return true;
  } catch {
    return false;
  }
}
