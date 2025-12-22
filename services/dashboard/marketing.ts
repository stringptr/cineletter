import * as yearlyByCompanyQuery from "@/db/queries/title/agregate/yearly-by-company.ts";

export async function overview(
  company_id: number = 0,
) {
  const data = await yearlyByCompanyQuery.movieVsTvUnified(company_id);

  return data;
}
