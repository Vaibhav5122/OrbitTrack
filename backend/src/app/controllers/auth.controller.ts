import type { Request, Response } from "express";
import type {
  LoginUserSchema,
  RegisterUserSchemaType,
} from "../validations/user.validation.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import {
  REFRESH_COOKIE_NAME,
  getClearRefreshTokenCookieOptions,
  getRefreshTokenCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util.js";

export class AuthController {
  public async handleRegister(
    req: Request<{}, {}, RegisterUserSchemaType>,
    res: Response,
  ) {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw ApiError.emailExists("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ...(role ? { role } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ id: user.id });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getRefreshTokenCookieOptions(),
    );

    return ApiResponse.created(res, "User registered successfully", {
      user,
      accessToken,
    });
  }

  public async handleLogin(
    req: Request<{}, {}, LoginUserSchema>,
    res: Response,
  ) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ id: user.id });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getRefreshTokenCookieOptions(),
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return ApiResponse.ok(res, "Login successful", {
      user: safeUser,
      accessToken,
    });
  }

  public async handleRefreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw ApiError.unauthorized("Refresh token missing in cookies");
    }

    let payload: { id: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      res.clearCookie(
        REFRESH_COOKIE_NAME,
        getClearRefreshTokenCookieOptions(),
      );
      throw ApiError.unauthorized("Refresh token expired or invalid");
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!savedToken || savedToken.revoked || savedToken.expiresAt < new Date()) {
      res.clearCookie(
        REFRESH_COOKIE_NAME,
        getClearRefreshTokenCookieOptions(),
      );
      throw ApiError.unauthorized("Refresh token revoked or expired");
    }

    if (savedToken.userId !== payload.id) {
      res.clearCookie(
        REFRESH_COOKIE_NAME,
        getClearRefreshTokenCookieOptions(),
      );
      throw ApiError.unauthorized("Token user mismatch");
    }

    await prisma.refreshToken.update({
      where: { id: savedToken.id },
      data: { revoked: true },
    });

    const newAccessToken = signAccessToken({
      id: savedToken.user.id,
      email: savedToken.user.email,
      role: savedToken.user.role,
    });

    const newRefreshToken = signRefreshToken({ id: savedToken.user.id });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: savedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie(
      REFRESH_COOKIE_NAME,
      newRefreshToken,
      getRefreshTokenCookieOptions(),
    );

    const safeUser = {
      id: savedToken.user.id,
      name: savedToken.user.name,
      email: savedToken.user.email,
      role: savedToken.user.role,
      createdAt: savedToken.user.createdAt,
    };

    return ApiResponse.ok(res, "Token refreshed successfully", {
      user: safeUser,
      accessToken: newAccessToken,
    });
  }

  public async handleLogout(req: Request, res: Response) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (refreshToken) {
      await prisma.refreshToken
        .updateMany({
          where: { token: refreshToken },
          data: { revoked: true },
        })
        .catch(() => {});
    }

    res.clearCookie(
      REFRESH_COOKIE_NAME,
      getClearRefreshTokenCookieOptions(),
    );

    return ApiResponse.ok(res, "Logged out successfully", null);
  }

  public async handleGetMe(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return ApiResponse.ok(res, "Current user profile fetched", user);
  }

  public async handleGetTeam(_req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    return ApiResponse.ok(res, "Team members fetched successfully", users);
  }
}
