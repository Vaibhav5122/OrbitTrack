import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authenticateJwt } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new NotificationController();

router.use(authenticateJwt);

router.get("/", controller.handleGetNotifications.bind(controller));
router.get("/unread-count", controller.handleGetUnreadCount.bind(controller));
router.patch("/mark-all-read", controller.handleMarkAllAsRead.bind(controller));
router.patch("/:id/read", controller.handleMarkAsRead.bind(controller));

export const notificationRoutes: Router = router;
