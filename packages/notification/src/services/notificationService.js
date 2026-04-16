import { Notification } from "../models/Notification.js";

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

// Get user's notification count
export const getUserNotificationCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      user: userId,
      read: false,
    });
    return count;
  } catch (error) {
    throw new Error(`Failed to get notification count: ${error.message}`);
  }
};

// Delete notification by ID and user
export const deleteNotificationByUser = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
    return notification;
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

// Clear all user notifications
export const clearAllUserNotifications = async (userId) => {
  try {
    const result = await Notification.deleteMany({ user: userId });
    return result;
  } catch (error) {
    throw new Error(`Failed to clear notifications: ${error.message}`);
  }
};
