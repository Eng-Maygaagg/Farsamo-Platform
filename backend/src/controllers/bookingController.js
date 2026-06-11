const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateBookingId = require('../utils/generateBookingId');
const { createNotification } = require('../services/notificationService');
const { BOOKING_STATUS, NOTIFICATION_TYPES, ROLES } = require('../config/constants');

const populateBooking = [
  { path: 'customerId', select: 'fullName email phone avatar' },
  { path: 'providerId', populate: { path: 'userId', select: 'fullName email phone avatar' } },
  { path: 'serviceId', select: 'name slug basePrice' },
];

const createBooking = asyncHandler(async (req, res) => {
  const { providerId, serviceId, date, time, location, notes } = req.body;

  const provider = await Provider.findById(providerId);
  if (!provider) throw new ApiError(404, 'Provider not found');
  if (provider.verificationStatus !== 'approved') throw new ApiError(400, 'Provider is not verified');

  const service = await Service.findById(serviceId);
  if (!service) throw new ApiError(404, 'Service not found');

  const pricing = provider.pricing.find((p) => p.serviceId.toString() === serviceId);
  const price = pricing?.price || service.basePrice;

  const booking = await Booking.create({
    bookingId: generateBookingId(),
    customerId: req.user._id,
    providerId,
    serviceId,
    date,
    time,
    location,
    notes,
    price,
    status: BOOKING_STATUS.SUBMITTED,
    statusHistory: [{ status: BOOKING_STATUS.SUBMITTED, changedBy: req.user._id }],
  });

  const populated = await Booking.findById(booking._id).populate(populateBooking);

  const providerUser = await User.findById(provider.userId);
  await createNotification({
    userId: provider.userId,
    type: NOTIFICATION_TYPES.BOOKING_CREATED,
    title: 'New Booking Request',
    message: `You have a new booking request for ${service.name}`,
    data: { bookingId: booking.bookingId },
    channels: { email: true, sms: true, inApp: true },
  });

  res.status(201).json({ success: true, message: 'Booking created', data: populated });
});

const getBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (req.user.role === ROLES.CUSTOMER) {
    filter.customerId = req.user._id;
  } else if (req.user.role === ROLES.PROVIDER) {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) throw new ApiError(404, 'Provider profile not found');
    filter.providerId = provider._id;
  }

  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter).populate(populateBooking).sort('-createdAt').skip(skip).limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: bookings,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(populateBooking);
  if (!booking) throw new ApiError(404, 'Booking not found');
  res.json({ success: true, data: booking });
});

const trackBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingId: req.params.bookingId }).populate(populateBooking);
  if (!booking) throw new ApiError(404, 'Booking not found');
  res.json({ success: true, data: booking });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, note, cancellationReason } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const validTransitions = {
    [BOOKING_STATUS.SUBMITTED]: [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
    [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
    [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
    [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
  };

  const allowed = validTransitions[booking.status] || [];
  if (!allowed.includes(status) && req.user.role !== ROLES.ADMIN) {
    throw new ApiError(400, `Cannot transition from ${booking.status} to ${status}`);
  }

  booking.status = status;
  booking.statusHistory.push({ status, note, changedBy: req.user._id });
  if (cancellationReason) booking.cancellationReason = cancellationReason;

  if (status === BOOKING_STATUS.COMPLETED) {
    const provider = await Provider.findById(booking.providerId);
    if (provider) {
      provider.totalJobs += 1;
      provider.totalEarnings += booking.price;
      await provider.save();
    }
  }

  await booking.save();
  const populated = await Booking.findById(booking._id).populate(populateBooking);

  const notificationMap = {
    [BOOKING_STATUS.ACCEPTED]: NOTIFICATION_TYPES.BOOKING_ACCEPTED,
    [BOOKING_STATUS.REJECTED]: NOTIFICATION_TYPES.BOOKING_REJECTED,
    [BOOKING_STATUS.COMPLETED]: NOTIFICATION_TYPES.BOOKING_COMPLETED,
  };

  if (notificationMap[status]) {
    await createNotification({
      userId: booking.customerId,
      type: notificationMap[status],
      title: `Booking ${status}`,
      message: `Your booking ${booking.bookingId} has been ${status}`,
      data: { bookingId: booking.bookingId },
      channels: { email: true, sms: true, inApp: true },
    });
  }

  res.json({ success: true, message: 'Booking status updated', data: populated });
});

const getBookingStats = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === ROLES.CUSTOMER) filter.customerId = req.user._id;
  if (req.user.role === ROLES.PROVIDER) {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (provider) filter.providerId = provider._id;
  }

  const stats = await Booking.aggregate([
    { $match: filter },
    { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$price' } } },
  ]);

  res.json({ success: true, data: stats });
});

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  trackBooking,
  updateBookingStatus,
  getBookingStats,
};
