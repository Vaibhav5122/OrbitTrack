import { z } from "zod";
import { ApiError } from "../../common/utils/ApiError.js";

const envSchema = z.object({
  PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGIN: z.string().optional(),
  CLIENT_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function parsedEnvSchema(env: NodeJS.ProcessEnv) {
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw ApiError.fromZod(parsedEnv.error);
  }
  const clientOrigin =
    parsedEnv.data.CLIENT_ORIGIN ||
    parsedEnv.data.CLIENT_URL ||
    "http://localhost:3000";

  return {
    ...parsedEnv.data,
    CLIENT_ORIGIN: clientOrigin,
  };
}

export const envZod = parsedEnvSchema(process.env);
