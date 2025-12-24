import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { types } from "@/db/queries/title/attributes.ts";

export async function GET(_red: NextApiRequest) {
  const res = await types();
  return NextResponse.json(res);
}
