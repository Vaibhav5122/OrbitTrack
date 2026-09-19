import { z } from "zod";

export const createClientSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Client name is required" : "Invalid text",
    })
    .trim()
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name is too long"),
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined ? "Email is required" : "Invalid email format",
    })
    .trim()
    .toLowerCase(),
  company: z.string().trim().max(100, "Company name is too long").optional(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientSchemaType = z.infer<typeof createClientSchema>;
export type UpdateClientSchemaType = z.infer<typeof updateClientSchema>;
