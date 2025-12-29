import { NextResponse } from "next/server";
import { companyDetails } from "@/db/queries/company/main.ts";

export async function GET(
  _req: Request,
  context: { params: Promise<{ company_id: number }> },
) {
  const company_id = (await context.params).company_id;
  return company_id
    ? NextResponse.json(await companyDetails(company_id))
    : NextResponse.json(null);
}
