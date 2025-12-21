import { z } from "zod";

export const generalSuccessSchema = z.object({
  success: z.boolean(),
  error_code: z.string().nullable(),
  message: z.string().nullable(),
});
