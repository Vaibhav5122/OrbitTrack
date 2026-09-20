import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "First name is required"
          : "Invalid text format",
    })
    .trim()
    .min(2, "Name must be atleast 2 character long")
    .max(55, "Name is too long"),

  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email address is required"
          : "Please enter a valid email address with an '@' and domain (e.g. name@orbittrack.com)",
    })
    .trim()
    .max(322, "Email is too long")
    .toLowerCase(),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Invalid text format",
    })
    .min(6, "Password to short")
    .max(66, "Password too long")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain a number and a special character",
    ),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "DEVELOPER"]).optional(),
});

export const loginUserSchema = registerUserSchema.pick({
  email: true,
  password: true,
});

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
export type LoginUserSchema = z.infer<typeof loginUserSchema>;
