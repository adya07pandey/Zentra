import { z } from "zod";

export const createAccountSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50),

  type: z.enum(["ASSET", "LIABILITY", "REVENUE", "EXPENSE"]),
});

export const updateAccountSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  type: z.enum(["ASSET", "LIABILITY", "REVENUE", "EXPENSE"]).optional(),
});