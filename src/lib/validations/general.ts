import { z } from "zod";

export const addNewBikeSchema = z.object({
  name: z.string().min(3).max(25),
  model: z.string().min(3).max(25),
  color: z.string().min(3).max(25),
  location: z.string().min(3).max(25),
  available: z.boolean().default(true),
});

export const updateBikeSchema = addNewBikeSchema.partial();

export const ratingSchema = z.coerce.number().int().min(1).max(5);

export const filterFormSchema = z.object({
  source: z.string().optional(),
  dest: z.string().optional(),
  date: z.date().optional(),
});
