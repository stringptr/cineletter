import { NextResponse } from "next/server";
import * as queries from "@/db/queries/company/executive/kpi&chart.ts";

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
  const year_back = Number(searchParams.get("year_back")) ?? 10;
  const region = searchParams.get("region") ?? null;
  const sort_by = searchParams.get("sort_by") ?? "rate_count";
  const titleType = searchParams.get("title_type") ?? null;

  switch (type) {
    case "company_genre_rating": {
      const res = await queries.genreRating(
        Number((await context.params).company_id),
        year,
        region,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "company_title_success": {
      const res = await queries.titleSuccess(
        Number((await context.params).company_id),
        year,
        genre,
        region,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "company_total_production": {
      const res = await queries.companyTotalProduction(
        Number((await context.params).company_id),
        year,
        genre,
        region,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "company_average_rating": {
      const res = await queries.companyAverageRating(
        Number((await context.params).company_id),
        year,
        genre,
        region,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "top_companies_production": {
      const res = await queries.topCompaniesProduction(
        num,
        year,
        genre,
        region,
        titleType,
      );
      return NextResponse.json(res);
    }

    case "top_companies_rating_rate_count": {
      const res = await queries.topCompaniesRatingRateCount(
        num,
        year,
        genre,
        region,
        titleType,
        sort_by,
      );
      return NextResponse.json(res);
    }

    case "company_yearly_performance": {
      const res = await queries.companyYearlyPerformance(
        Number((await context.params).company_id),
        year_back,
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
