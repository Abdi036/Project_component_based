import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
} from "../controllers/notificationController.js";

export const notificationRoutes = (protect) => {
  const router = express.Router();

  // Protect all routes with auth middleware
  router.use(protect);

  router.get("/", getMyNotifications);
  router.patch("/read-all", markAllNotificationsRead);
  router.patch("/:id/read", markNotificationRead);
  router.delete("/:id", deleteNotification);
  router.delete("/", clearNotifications);

  return router;
};
