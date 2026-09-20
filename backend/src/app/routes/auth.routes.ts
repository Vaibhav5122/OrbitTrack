import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validation.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  authController.handleRegister.bind(authController)
);

authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  authController.handleLogin.bind(authController)
);

authRouter.post("/refresh", authController.handleRefreshToken.bind(authController));

authRouter.post("/logout", authController.handleLogout.bind(authController));

authRouter.get("/me", authenticateJwt, authController.handleGetMe.bind(authController));
authRouter.get("/team", authenticateJwt, authController.handleGetTeam.bind(authController));

export const authRoutes: Router = authRouter;
