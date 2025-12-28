import { z } from "zod";

export const personExploreSchema = z.object({
  person_id: z.string(),
  person_name: z.string().nullable(),
  birth_year: z.int().nullable().optional(),
  death_year: z.int().nullable().optional(),
  primary_profession: z.array(z.string()).nullable().optional(),
});
