import { NextResponse } from "next/server";
import { company } from "@/services/user/role.ts";

export async function GET() {
  const res = await company();
  return NextResponse.json(res);
}
