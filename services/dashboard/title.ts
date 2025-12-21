import * as title from "@/db/queries/dashboard/title.ts";

export async function completeDataGet(title_id: string) {
  const res = await title.completeDataGet(title_id);
  return res;
}

export async function titleUpdate(title_id: string) {
  const res = await title.titleUpdate(title_id);
  return res;
}
