import { NextResponse } from "next/server";

import { userLogin } from "../../../services/userService.ts";

export async function POST(req: Request) {
  const { id, password } = await req.json();

  const res = await userLogin(id, password);

  return NextResponse.json(res);
}
