import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { genres } from "@/db/queries/title/attributes.ts";

export async function GET(_red: NextApiRequest) {
  const res = await genres();
  return NextResponse.json(res);
}
