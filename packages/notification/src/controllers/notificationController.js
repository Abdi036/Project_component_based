import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";

// @desc      Get current user's notifications
// @route     GET /api/v1/notifications
// @access    Private
export const getMyNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);

  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

// @desc      Mark one notification as read
// @route     PATCH /api/v1/notifications/:id/read
// @access    Private
export const markNotificationRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.id,
    },
    { read: true },
    { new: true },
  );

  if (!notification) {
    return next(new ErrorResponse("Notification not found", 404));
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});

// @desc      Mark all notifications as read
// @route     PATCH /api/v1/notifications/read-all
// @access    Private
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, read: false },
    { $set: { read: true } },
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// @desc      Delete one notification
// @route     DELETE /api/v1/notifications/:id
// @access    Private
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!notification) {
    return next(new ErrorResponse("Notification not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted",
  });
});

// @desc      Clear all notifications
// @route     DELETE /api/v1/notifications
// @access    Private
export const clearNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });

  res.status(200).json({
    success: true,
    message: "Notifications cleared",
  });
});
