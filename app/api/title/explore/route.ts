import { explore, search } from "@/services/title/title.ts";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
) {
  try {
    const searchParams = new URL(req.url).searchParams;

    const searchTerm = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("page_size") ?? 20);
    const sortBy = searchParams.get("sort_by") ?? "relevance";
    const invertSort = searchParams.get("invert_sort") === "1";
    const genre = searchParams.get("genre");
    const type = searchParams.get("type");

    const data = String(searchTerm)?.trim() !== "" || null
      ? await search(
        searchTerm,
        page,
        pageSize,
        sortBy,
        invertSort,
        genre,
        type,
      )
      : await explore(
        page,
        pageSize,
        sortBy,
        invertSort,
        genre,
        type,
      );

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 },
    );
  }
}
