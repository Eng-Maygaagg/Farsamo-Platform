const Provider = require('../models/Provider');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getProviders = asyncHandler(async (req, res) => {
  const { service, rating, location, minPrice, maxPrice, page = 1, limit = 12, search } = req.query;
  const filter = { verificationStatus: 'approved', isAvailable: true };

  if (location) filter.location = new RegExp(location, 'i');
  if (rating) filter.rating = { $gte: Number(rating) };
  if (service) filter.profession = new RegExp(service, 'i');
  if (search) {
    filter.$or = [
      { profession: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
      { bio: new RegExp(search, 'i') },
    ];
  }

  const skip = (page - 1) * limit;
  let providers = await Provider.find(filter)
    .populate('userId', 'fullName email phone avatar')
    .populate('services', 'name slug basePrice')
    .sort('-rating')
    .skip(skip)
    .limit(Number(limit));

  if (minPrice || maxPrice) {
    providers = providers.filter((p) => {
      const prices = p.pricing.map((pr) => pr.price);
      const min = Math.min(...prices, Infinity);
      if (minPrice && min < Number(minPrice)) return false;
      if (maxPrice && min > Number(maxPrice)) return false;
      return true;
    });
  }

  const total = await Provider.countDocuments(filter);

  res.json({
    success: true,
    data: providers,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const getTopProviders = asyncHandler(async (req, res) => {
  const providers = await Provider.find({ verificationStatus: 'approved' })
    .populate('userId', 'fullName avatar')
    .populate('services', 'name')
    .sort('-rating')
    .limit(6);

  res.json({ success: true, data: providers });
});

const getProviderById = asyncHandler(async (req, res) => {
  const provider = await Provider.findById(req.params.id)
    .populate('userId', 'fullName email phone avatar')
    .populate('services', 'name slug description basePrice');

  if (!provider) throw new ApiError(404, 'Provider not found');
  res.json({ success: true, data: provider });
});

const getMyProviderProfile = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ userId: req.user._id })
    .populate('services', 'name slug basePrice');

  if (!provider) throw new ApiError(404, 'Provider profile not found');
  res.json({ success: true, data: provider });
});

const updateProviderProfile = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ userId: req.user._id });
  if (!provider) throw new ApiError(404, 'Provider profile not found');

  const allowed = ['bio', 'experience', 'location', 'services', 'pricing', 'certifications', 'profilePhoto', 'isAvailable'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) provider[field] = req.body[field];
  });

  await provider.save();
  const populated = await Provider.findById(provider._id).populate('services', 'name slug basePrice');

  res.json({ success: true, message: 'Profile updated', data: populated });
});

const updateAvailability = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ userId: req.user._id });
  if (!provider) throw new ApiError(404, 'Provider profile not found');

  provider.availability = req.body.availability;
  await provider.save();

  res.json({ success: true, message: 'Availability updated', data: provider.availability });
});

const getProviderEarnings = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ userId: req.user._id });
  if (!provider) throw new ApiError(404, 'Provider profile not found');

  const Booking = require('../models/Booking');
  const monthlyEarnings = await Booking.aggregate([
    { $match: { providerId: provider._id, status: 'completed' } },
    {
      $group: {
        _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } },
        total: { $sum: '$price' },
        jobs: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  res.json({
    success: true,
    data: {
      totalEarnings: provider.totalEarnings,
      totalJobs: provider.totalJobs,
      rating: provider.rating,
      monthlyEarnings,
    },
  });
});

module.exports = {
  getProviders,
  getTopProviders,
  getProviderById,
  getMyProviderProfile,
  updateProviderProfile,
  updateAvailability,
  getProviderEarnings,
};
