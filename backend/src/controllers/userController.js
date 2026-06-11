const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['fullName', 'phone', 'avatar'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated', data: user });
});

const getCustomerDashboard = asyncHandler(async (req, res) => {
  const Booking = require('../models/Booking');
  const Review = require('../models/Review');

  const [activeBookings, completedJobs, reviews] = await Promise.all([
    Booking.countDocuments({
      customerId: req.user._id,
      status: { $in: ['submitted', 'pending', 'accepted', 'in_progress'] },
    }),
    Booking.countDocuments({ customerId: req.user._id, status: 'completed' }),
    Review.countDocuments({ customerId: req.user._id }),
  ]);

  const recentBookings = await Booking.find({ customerId: req.user._id })
    .populate('providerId')
    .populate('serviceId', 'name')
    .sort('-createdAt')
    .limit(5);

  res.json({
    success: true,
    data: { activeBookings, completedJobs, reviews, recentBookings },
  });
});

module.exports = { updateProfile, getCustomerDashboard };
