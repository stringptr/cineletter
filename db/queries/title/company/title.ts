import { sql } from "kysely";
import { z } from "zod";
import { withDbContext } from "@/db/context.ts";
import * as schemas from "@/schemas/title/main.ts";

const titleListCompany = z.array(z.object({
  title_id: z.string(),
  title: z.string().nullable(),
}));

export async function allTitleCompany(
  company_id: number,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<z.infer<typeof titleListCompany>>(
      sql`EXEC APP.spAllTitleCompanyGet ${company_id}`
        .compile(trx),
    );

    return titleListCompany.parse(result.rows);
  });
}

export async function titleSearchByCompany(
  company_id: number,
  searched: string,
  page: number | null,
  page_size: number | null,
  sort_by: string | null = "year",
  invert_sort: boolean | null,
  genre: string | null,
  type: string | null,
) {
  return withDbContext(async (trx) => {
    const result = await trx.executeQuery<
      Array<z.infer<typeof schemas.searchSchema>>
    >(
      sql`
        EXEC APP.spSearchTitlesByCompany @title=${searched}, @page_number=${page}, @page_size=${page_size}, @sort_by=${sort_by}, @invert_sort=${invert_sort}, @genre=${genre}, @type=${type}, @company_id=${company_id};
    `.compile(trx),
    );

    const parsed = result.rows.map((r) =>
      schemas.searchSchema.parse({
        ...r,
        title_akas: JSON.parse(r.title_akas),
      })
    );

    return parsed;
  });
}
