import * as user from "@/db/queries/user.ts";

export async function detailGet() {
  const res = await user.detailsGet();
  return res;
}
