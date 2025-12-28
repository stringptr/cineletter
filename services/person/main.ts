import * as personQuery from "@/db/queries/person.ts";

export async function getPersonDetails(person_id: string) {
  return await personQuery.getPersonDetails(person_id);
}

export async function explore(
  primary_profession: string | null = null,
  sort_by: string | null = "name",
  invert_sort: boolean = false,
  page_number: number = 1,
  page_size: number = 20,
) {
  console.log(page_size);
  return await personQuery.personExplore(
    primary_profession,
    sort_by,
    invert_sort,
    page_number,
    page_size,
  );
}

export async function search(
  search: string,
  primary_profession: string | null,
  sort_by: string | null = "relevance",
  invert_sort: boolean = false,
  page_number: number | null = 1,
  page_size: number | null = 24,
) {
  return await personQuery.personSearch(
    search,
    primary_profession,
    sort_by,
    invert_sort,
    page_number,
    page_size,
  );
}
