import { NextResponse } from "next/server";
import * as queries from "@/db/queries/company/attributes.ts";

export async function GET(
  req: Request,
  context: { params: Promise<{ company_id: number }> },
) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  switch (type) {
    case "years": {
      const res = queries.distinctYears((await context.params).company_id);
      return NextResponse.json(res);
    }
    case "genres": {
      const res = queries.distinctGenres((await context.params).company_id);
      return NextResponse.json(res);
    }
    case "types": {
      const res = queries.distinctTypes((await context.params).company_id);
      return NextResponse.json(res);
    }
    case "regions": {
      const res = queries.distinctRegions((await context.params).company_id);
      return NextResponse.json(res);
    }
    case "all": {
      const [years, genres, types, regions] = await Promise.all([
        await queries.distinctYears((await context.params).company_id),
        await queries.distinctGenres((await context.params).company_id),
        await queries.distinctTypes((await context.params).company_id),
        await queries.distinctRegions((await context.params).company_id),
      ]);
      return NextResponse.json({ years, genres, types, regions });
    }
  }
}
