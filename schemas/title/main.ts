import { z } from "zod";

export const detailsSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable().default(null),
  original_title: z.string().nullable().default(null),
  tagline: z.string().nullable().default(null),
  overview: z.string().nullable().default(null),
  type: z.string().nullable().default(null),
  is_adult: z.boolean().nullable().default(null),
  status: z.string().nullable().default(null),
  season_number: z.number().nullable().default(null),
  episode_number: z.number().nullable().default(null),
  runtime_minute: z.number().nullable().default(null),
  start_year: z.number().nullable().default(null),
  end_year: z.number().nullable().default(null),
  popularity: z.number().nullable().default(null),
  old_rate_count: z.number().nullable().default(null),
  old_average_rating: z.number().nullable().default(null),
  rate_count: z.number().nullable().default(null),
  average_rating: z.number().nullable().default(null),

  genres: z.array(z.string()).default([]),

  production_companies: z.array(
    z.object({
      company_id: z.number(),
      company_name: z.string(),
    }),
  ).default([]),

  regions: z.array(
    z.object({
      type: z.string(),
      code: z.string(),
    }),
  ).default([]),

  languages: z.array(
    z.object({
      language_code: z.string(),
    }),
  ).default([]),

  spoken_languages: z.array(
    z.object({
      spoken_language_id: z.number(),
      spoken_language_name: z.string(),
    }),
  ).default([]),

  networks: z.array(
    z.object({
      network_id: z.number(),
      network_name: z.string(),
    }),
  ).default([]),

  links: z.array(
    z.object({
      link_type: z.string(),
      link: z.string(),
    }),
  ).default([]),
});

export const searchSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable().default(null),
  overview: z.string().nullable().default(null),
  tagline: z.string().nullable().default(null),
  rate_count: z.number().nullable().default(null),
  average_rating: z.number().nullable().default(null),
  start_year: z.number().nullable().default(null),
  type: z.string(),
  relevance: z.number().nullable().default(null),
  title_akas: z.array(
    z.object({
      title: z.string(),
    }),
  ).default([]),
});

export const searchArraySchema = z.array(
  z.object({
    title_id: z.string(),
    title: z.string().nullable().default(null),
    overview: z.string().nullable().default(null),
    tagline: z.string().nullable().default(null),
    rate_count: z.number().nullable().default(null),
    average_rating: z.number().nullable().default(null),
    start_year: z.number().nullable().default(null),
    type: z.string(),
    relevance: z.number().nullable().default(null),
    title_akas: z.array(
      z.object({
        title: z.string(),
      }),
    ).default([]),
  }),
);

export const exploreSchema = z.object({
  title_id: z.string(),
  title: z.string().nullable().default(null),
  overview: z.string().nullable().default(null),
  tagline: z.string().nullable().default(null),
  rate_count: z.number().nullable().default(null),
  average_rating: z.number().nullable().default(null),
  start_year: z.number().nullable().default(null),
  type: z.string(),
  relevance: z.number().nullable().default(null),
});

export const exploreArraySchema = z.array(
  z.object({
    title_id: z.string(),
    title: z.string().nullable().default(null),
    overview: z.string().nullable().default(null),
    tagline: z.string().nullable().default(null),
    rate_count: z.number().nullable().default(null),
    average_rating: z.number().nullable().default(null),
    start_year: z.number().nullable().default(null),
    type: z.string(),
    relevance: z.number().nullable().default(null),
  }),
);
