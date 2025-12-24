import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import * as titleService from "@/services/title/update.ts";
import { getCompleteData } from "@/db/queries/title/title.ts";

export async function GET(
  _req: Request,
  context: { params: Promise<{ title_id: string }> },
) {
  const data = await getCompleteData((await context.params).title_id);
  return Response.json(data);
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json();
    const result = await titleService.updateTitleComplete(payload);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({
      success: false,
      error: err.message || "Unknown error",
    }, { status: 500 });
  }
}
