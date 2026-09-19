import jwt, { type SignOptions } from "jsonwebtoken";
import type { CookieOptions } from "express";
import type { Role } from "@prisma/client";
import { envZod } from "../../common/utils/envSanitization.js";

export interface TokenUserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface RefreshTokenJwtPayload {
  id: string;
}

export const REFRESH_COOKIE_NAME = "ORBITTRACK_TOKEN";

export function signAccessToken(payload: TokenUserPayload): string {
  const signOptions: SignOptions = {
    expiresIn: envZod.ACCESS_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
  };
  return jwt.sign(payload, envZod.JWT_ACCESS_SECRET, signOptions);
}

export function signRefreshToken(payload: RefreshTokenJwtPayload): string {
  const signOptions: SignOptions = {
    expiresIn: envZod.REFRESH_TOKEN_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
  };
  return jwt.sign(payload, envZod.JWT_REFRESH_SECRET, signOptions);
}

export function verifyAccessToken(token: string): TokenUserPayload {
  return jwt.verify(token, envZod.JWT_ACCESS_SECRET) as TokenUserPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenJwtPayload {
  return jwt.verify(token, envZod.JWT_REFRESH_SECRET) as RefreshTokenJwtPayload;
}

export function getRefreshTokenCookieOptions(): CookieOptions {
  const isProduction = envZod.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

export function getClearRefreshTokenCookieOptions(): CookieOptions {
  const isProduction = envZod.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
  };
}
