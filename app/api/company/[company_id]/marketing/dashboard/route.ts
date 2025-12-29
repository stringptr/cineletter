import { NextResponse } from "next/server";
import * as queries from "@/db/queries/company/marketing/kpi&chart.ts";

export async function GET(
  req: Request,
  context: { params: Promise<{ company_id: number }> },
) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const num = Number(searchParams.get("num")) === 0
    ? 5
    : Number(searchParams.get("num"));
  const genre = searchParams.get("genre") ?? null;
  const year = Number(searchParams.get("year")) ?? null;
  const region = searchParams.get("region") ?? null;
  const sort_by = searchParams.get("sort_by") ?? "rate_count";
  const titleType = searchParams.get("title_type") ?? null;

  switch (type) {
    case "company_language_title_count": {
      const res = await queries.languageTitleCount(
        (await context.params).company_id,
        year,
        genre,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "company_region_rating": {
      const res = await queries.regionRating(
        Number((await context.params).company_id),
        year,
        genre,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "company_title_rating_bin": {
      const res = await queries.titleRatingBins(
        Number((await context.params).company_id),
        year,
        genre,
        region,
        titleType,
      );
      return NextResponse.json(res);
    }

    default:
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 },
      );
  }
}
