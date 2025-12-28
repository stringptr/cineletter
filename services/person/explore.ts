import { personExplore } from "@/db/queries/person.ts";

export async function explorePerson(
  searched: string | null,
  page_number: number | null = 1,
  page_size: number | null = 20,
) {
  return await personExplore(searched, page_number, page_size);
}
