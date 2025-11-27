import { NextResponse } from "next/server";
import { userSignup } from "@/services/user.ts";

export async function POST(req: Request) {
  const { id, name, password } = await req.json();

  const res = await userSignup(id, name, password);

  return NextResponse.json(res);
}
