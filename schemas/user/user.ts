import { z } from "zod";

export const companyRolesSchema = z.object({
  is_active: z.boolean().default(false),
  company_id: z.number(),
  company_name: z.string(),
  type: z.enum(["marketing", "executive"]),
}).nullable();

export const databaseRolesSchema = z.object({
  is_active: z.boolean().default(false),
  type: z.enum(["data", "company_roles"]),
}).nullable();

export const companyRolesArraySchema = z.array(companyRolesSchema).nullable();

export const databaseRolesArraySchema = z.array(databaseRolesSchema).nullable();

export const rolesSchema = z.object({
  companyRolesArraySchema,
  databaseRolesArraySchema,
});

export const authInfoSchema = z.object({
  username: z.string(),
  email: z.string(),
  user_id: z.number(),
  hashed_password: z.instanceof(Buffer),
});

export const existSchema = z.object({
  exist: z.boolean(),
  error_code: z.string().nullable(),
  type: z.enum(["username", "email"]).nullable(),
});

export const detailsSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  gender: z.string().nullable(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, _ and . allowed"),

  name: z.string().min(1, "Name is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  passwordVerif: z.string(),
}).refine(
  (data) => data.password === data.passwordVerif,
  {
    message: "Passwords do not match",
    path: ["passwordVerif"],
  },
);

export const loginSchema = z.object({
  credential: z
    .string()
    .min(4, "Username or email is required"),
  password: z
    .string()
    .min(1, "Password must be at least 8 characters"),
});
