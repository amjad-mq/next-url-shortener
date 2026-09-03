import {z} from "zod"

export const createUrlSchema = z.object({
 url: z
    .string()
    .trim()
    .min(1, { message: "URL is required" })
    .url({ message: "Please enter a valid URL (e.g. https://example.com)" })
    .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;