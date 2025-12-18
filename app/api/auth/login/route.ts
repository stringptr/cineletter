import { NextResponse } from "next/server";
import login from "@/services/user/auth.ts";

export async function POST(req: Request) {
  const { id, password } = await req.json();

  const res = await userLogin(id, password);

  return NextResponse.json(res);
}
