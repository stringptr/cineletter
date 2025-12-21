import { NextResponse } from "next/server";
import { rolesGet } from "@/services/user/role.ts";

export async function GET() {
  const res = await rolesGet();
  return NextResponse.json(res);
}
