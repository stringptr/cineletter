import * as query from "@/db/queries/title/company/title.ts";

export async function getAllTitleCompany(
  searched: string,
  page: number | null,
  page_size: number | null,
  sort_by: string | null,
  invert_sort: boolean | null,
  genre: string | null,
  type: string | null,
  company_id: number,
) {
  return await query.titleSearchByCompany(
    searched,
    page,
    page_size,
    sort_by,
    invert_sort,
    genre,
    type,
    company_id,
  );
}
