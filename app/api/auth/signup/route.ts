import { NextResponse } from "next/server";
import { signup } from "@/services/user/auth.ts";

export async function POST(req: Request) {
  const {email, username, name, password} = await req.json();

  const res = await signup(email, username, name, password);

  return NextResponse.json(res);
}
