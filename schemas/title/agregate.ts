import { z } from "zod";

export const movieVsTvNumberArray = z.array(
  z.object({
    year: z.number(),
    movie: z.number().nullable(),
    tv: z.number().nullable(),
  }),
);

export const movieVsTvNumber = z.object({
  year: z.number(),
  movie: z.number(),
  tv: z.number(),
});

export const movieVsTvUnifiedArray = z.array(z.object({
  year: z.number(),
  movie_count: z.number().nullable(),
  tv_count: z.number().nullable(),
  movie_avg_rating: z.number().nullable(),
  tv_avg_rating: z.number().nullable(),
  movie_sum_rate_count: z.number().nullable(),
  tv_sum_rate_count: z.number().nullable(),
  movie_avg_rate_count: z.number().nullable(),
  tv_avg_rate_count: z.number().nullable(),
}));
