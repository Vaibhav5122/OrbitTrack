import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Task title is required" : "Invalid text",
    })
    .trim()
    .min(2, "Task title must be at least 2 characters")
    .max(150, "Task title is too long"),
  description: z.string().trim().max(2000, "Description is too long").optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  dueDate: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Due date is required" : "Invalid date format",
    })
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  assignedToId: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"], {
    error: (issue) =>
      issue.input === undefined
        ? "Status is required"
        : "Status must be TODO, IN_PROGRESS, IN_REVIEW, or DONE",
  }),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),
  assignedToId: z.string().nullable().optional(),
});

export const taskQueryFilterSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDateFrom: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),
  dueDateTo: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),
  projectId: z.string().optional(),
  assignedToId: z.string().optional(),
  isOverdue: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusSchemaType = z.infer<typeof updateTaskStatusSchema>;
export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;
export type TaskQueryFilterSchemaType = z.infer<typeof taskQueryFilterSchema>;
