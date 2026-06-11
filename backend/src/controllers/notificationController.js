const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const filter = { userId: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId: req.user._id, isRead: false }),
  ]);

  res.json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.json({ success: true, data: notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = { getNotifications, markAsRead, markAllAsRead };
