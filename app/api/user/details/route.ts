import { NextResponse } from "next/server";
import { details } from "@/services/user/user.ts";

export async function GET() {
  const res = await details();
  return NextResponse.json(res);
}
