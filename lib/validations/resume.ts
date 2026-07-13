import { z } from "zod";

export const uploadResumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title cannot exceed 100 characters."),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;