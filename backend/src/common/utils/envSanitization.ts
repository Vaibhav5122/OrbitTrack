import { z } from "zod";
import { ApiError } from "../../common/utils/ApiError.js";

const envSchema = z.object({
  PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

function parsedEnvSchema(env: NodeJS.ProcessEnv) {
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw ApiError.fromZod(parsedEnv.error);
  }
  return parsedEnv.data;
}

export const envZod = parsedEnvSchema(process.env);
