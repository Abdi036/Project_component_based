// Export core components for notification consumers to use
export { notificationRoutes } from "./src/routes/notificationRoutes.js";
export { Notification } from "./src/models/Notification.js";
export {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
} from "./src/controllers/notificationController.js";
export {
  createNotification,
  deleteNotificationByUser,
} from "./src/services/notificationService.js";
