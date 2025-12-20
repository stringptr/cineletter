import * as user from "@/db/queries/user.ts";

export async function details() {
  const res = await user.detailsGet();
  return res;
}
