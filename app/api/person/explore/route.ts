import { explore, search } from "@/services/person/main.ts";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;

  const rawSearch = searchParams.get("search");
  const searchTerm = rawSearch?.trim() || null;

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("page_size") ?? 24);
  const sortBy = searchParams.get("sort_by") ?? "name";
  const invertSort = searchParams.get("invert_sort") === "1";
  const primaryProfession = searchParams.get("primary_profession");
  console.log(searchParams);

  const data = searchTerm
    ? await search(
      searchTerm,
      primaryProfession,
      sortBy,
      invertSort,
      page,
      pageSize,
    )
    : await explore(
      primaryProfession,
      sortBy,
      invertSort,
      page,
      pageSize,
    );

  return NextResponse.json({ success: true, data });
}
