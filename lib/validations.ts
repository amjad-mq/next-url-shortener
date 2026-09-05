import { z } from "zod";

const RESERVED_ALIASES = [
  "api",
  "admin",
  "login",
  "logout",
  "signup",
  "about",
  "contact",
  "settings",
  "dashboard",
];

export const createUrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, { message: "URL is  required" })
    .url({ message: "Please enter a valid URL (e.g. https: //example.com)" })
    .refine((val) => val.startsWith("https://") || val.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
  customAlias: z
    .string()
    .trim()
    .min(3, { message: "Alias must be at least 3 characters" })
    .max(30, { message: "alias must be at most 30 characters." })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "alias can only contain letters, numbers, hyphens",
    })
    .refine((val) => !RESERVED_ALIASES.includes(val.toLocaleLowerCase()), {
      message: "This alias is reserved and cannot be used",
    })
    .optional()
    .or(z.literal("")),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
