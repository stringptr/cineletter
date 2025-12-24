import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import * as titleService from "@/services/title/update.ts";
import { getCompleteData } from "@/db/queries/title/title.ts";

export async function GET(
  _req: Request,
  context: { params: Promise<{ title_id: string }> },
) {
  try {
    const title_id = (await context.params).title_id;
    revalidateTag(`title_detail:${title_id}`);
    revalidateTag(`title_data:${title_id}`);
    return NextResponse.json(true);
  } catch (err: any) {
    throw new Error(`${err}`);
  }
}
