import { z } from "zod";

export const baseUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
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
          : "Invalid password format",
    })
    .min(6, "Password must be at least 6 characters long")
    .max(66, "Password is too long")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one number and one special character (!@#$%^&*)"
    ),

  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "DEVELOPER"]),
});

export const loginUserSchema = baseUserSchema.pick({
  email: true,
  password: true,
});

export const registerUserSchema = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type RegisterUserFormValues = z.infer<typeof registerUserSchema>;
export type LoginUserFormValues = z.infer<typeof loginUserSchema>;
