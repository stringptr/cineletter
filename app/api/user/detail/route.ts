import { NextResponse } from "next/server";
import { detailGet } from "@/services/user/user.ts";

export async function GET() {
  const res = await detailGet();
  return NextResponse.json(res);
}

export async function PATCH(req: Request) {
  const { name, gender, description } = await req;
  const res = await detailGet();
  return NextResponse.json(res);
}
