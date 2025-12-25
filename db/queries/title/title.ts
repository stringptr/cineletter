import { sql } from "kysely";

import withDbContext from "@/db/context.ts";
import { z } from "zod";
import * as schemas from "@/schemas/title/main.ts";
import * as base_schemas from "@/schemas/title/base.ts";

export async function getDetails(title_id: string) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.detailsSchema>
    >(sql`
        EXEC APP.spGetTitleDetails ${title_id};
    `.compile(trx));

    const row = result.rows?.[0];

    if (!row || typeof row.result !== "string") {
      throw new Error("not found");
    }

    const parsedJson = JSON.parse(row.result);
    const validated = schemas.detailsSchema.parse(parsedJson);
    return validated;
  });
}

export async function titleSearch(
  searched: string,
  page: number | null,
  page_size: number | null,
  sort_by: string | null,
  invert_sort: boolean | null,
  genre: string | null,
  type: string | null,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.searchArraySchema>
    >(sql`
        EXEC APP.spSearchTitles @title=${searched}, @page_number=${page}, @page_size=${page_size}, @sort_by=${sort_by}, @invert_sort=${invert_sort}, @genre=${genre}, @type=${type};
    `.compile(trx));

    const parsed = result.rows.map((r) =>
      r = {
        ...r,
        title_akas: JSON.parse(r.title_akas),
      }
    );

    return schemas.searchArraySchema.parse(parsed);
  });
}

export async function titleExplore(
  page: number | null,
  page_size: number | null,
  sort_by: string | null,
  invert_sort: boolean | null,
  genre: string | null,
  type: string | null,
) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      z.infer<typeof schemas.exploreArraySchema>
    >(
      sql`
        EXEC APP.spExploreTitles @page_number=${page}, @page_size=${page_size}, @sort_by=${sort_by}, @invert_sort=${invert_sort}, @genre=${genre}, @type=${type};
    `.compile(trx),
    );

    const parsed = schemas.exploreArraySchema.parse(result.rows);
    return parsed;
  });
}

export async function getCompleteData(title_id: string) {
  return await withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      {
        rows: Array<
          { JSON_DATA: z.infer<typeof base_schemas.titleCompleteSchema> }
        >;
      }
    >(sql`
        EXEC APP.spTitleCompleteDataGet ${title_id};
    `.compile(trx));

    const data = await JSON.parse(result.rows[0].JSON_DATA);
    const title = await JSON.parse(data.title);
    const parsed_json = { ...data, title };
    const parsed = base_schemas.titleCompleteSchema.parse(parsed_json);
    return parsed_json;
  });
}
