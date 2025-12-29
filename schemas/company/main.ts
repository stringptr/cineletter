import z from "zod";

export const companyDetailsSchema = z.object({
  company_id: z.int().positive().nonoptional(),
  company_name: z.string().nullable().optional(),
  title_count: z.int().positive().nullable().optional(),
  average_rating: z.float64().positive().nullable().optional(),
});

export const titleListCompany = z.array(z.object({
  title_id: z.string(),
  title: z.string().nullable(),
}));

export const companyLanguageSchema = z.object({
  language_code: z.string().nonempty().nonoptional().nullable(),
  title_count: z.int().positive().nonoptional(),
});

export const companyCountryRatingSchema = z.object({
  region_code: z.string().nonempty().nonoptional(),
  region_name: z.string().nullable().optional(),
  average_rating: z.float64().nonoptional().nullable(),
  rate_count: z.int().nonoptional().nullable(),
  title_count: z.int().optional().nullable(),
});

export const topCompaniesProductionSchema = z.object({
  company_id: z.int().nonoptional(),
  company_name: z.string().nonempty().nonoptional(),
  title_count: z.int().positive().nonoptional(),
});

export const topCompaniesRatingRateCountSchema = z.object({
  company_id: z.int().nonoptional(),
  company_name: z.string().nonempty().nonoptional(),
  rate_count: z.int().positive().nullable(),
  average_rating: z.float64().positive().nullable(),
});

export const companyTitleRatingBinsSchema = z.object({
  rating_bin: z.string().nonempty().nonoptional(),
  title_count: z.int().positive().nonoptional(),
});

export const companyGenreRatingSchema = z.object({
  genre: z.string().nullable().optional(),
  average_rating: z.float64().nonoptional().nullable(),
  rate_count: z.int().nonoptional().nullable(),
  title_count: z.int().optional().nullable(),
});

export const companyTitleSuccessSchema = z.object({
  indicator: z.string().nonempty().nonoptional(),
  title_count: z.int().positive().nonoptional(),
});

export const companyYearlyPerformanceSchema = z.object({
  year: z.int().positive().nonoptional(),
  title_count: z.int().positive().optional().optional(),
  average_rating: z.float64().positive().nullable().optional(),
  rate_count: z.int().positive().nullable().optional(),
});
