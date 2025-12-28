import { NextResponse } from "next/server";
import { primary_professions } from "@/db/queries/person.ts";

export async function GET(_req: Request) {
  const res = await primary_professions();
  return NextResponse.json(res);
}
