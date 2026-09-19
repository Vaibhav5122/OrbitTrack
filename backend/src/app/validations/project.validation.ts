import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Project name is required" : "Invalid text",
    })
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(120, "Project name is too long"),
  description: z.string().trim().max(1000, "Description is too long").optional(),
  clientId: z.string({
    error: (issue) =>
      issue.input === undefined ? "Client ID is required" : "Invalid Client ID",
  }),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
