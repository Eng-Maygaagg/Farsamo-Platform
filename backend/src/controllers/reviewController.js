const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../services/notificationService');
const { BOOKING_STATUS, NOTIFICATION_TYPES, REVIEW_STATUS } = require('../config/constants');

const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.customerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to review this booking');
  }
  if (booking.status !== BOOKING_STATUS.COMPLETED) {
    throw new ApiError(400, 'Can only review completed bookings');
  }

  const existing = await Review.findOne({ bookingId });
  if (existing) throw new ApiError(400, 'Review already submitted');

  const review = await Review.create({
    bookingId,
    customerId: req.user._id,
    providerId: booking.providerId,
    serviceId: booking.serviceId,
    rating,
    comment,
  });

  const provider = await Provider.findById(booking.providerId);
  if (provider) {
    const reviews = await Review.find({ providerId: provider._id, status: REVIEW_STATUS.APPROVED });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, rating) / (reviews.length + 1);
    provider.rating = Math.round(avgRating * 10) / 10;
    provider.reviewCount += 1;
    await provider.save();

    await createNotification({
      userId: provider.userId,
      type: NOTIFICATION_TYPES.NEW_REVIEW,
      title: 'New Review Received',
      message: `You received a ${rating}-star review`,
      data: { reviewId: review._id },
      channels: { email: true, inApp: true },
    });
  }

  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});

const getReviews = asyncHandler(async (req, res) => {
  const { providerId, status, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (providerId) filter.providerId = providerId;
  if (status) filter.status = status;
  if (req.user.role === 'customer') filter.customerId = req.user._id;

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('customerId', 'fullName avatar')
      .populate('providerId')
      .populate('serviceId', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: reviews,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.status = status;
  review.moderatedBy = req.user._id;
  review.moderatedAt = new Date();
  await review.save();

  res.json({ success: true, message: 'Review moderated', data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { createReview, getReviews, moderateReview, deleteReview };
