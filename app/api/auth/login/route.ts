import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { login } from "@/services/user/auth.ts";

export async function POST(req: Request) {
  const { credential, password } = await req.json();

  const res = await login(credential, password);

  if (res.success) {
    cookies().set({
      name: "session",
      value: res.session_id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return NextResponse.json(res);
}
