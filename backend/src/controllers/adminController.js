const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Review = require('../models/Review');
const ProviderVerification = require('../models/ProviderVerification');
const AdminLog = require('../models/AdminLog');
const PlatformSettings = require('../models/PlatformSettings');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../services/notificationService');
const { NOTIFICATION_TYPES } = require('../config/constants');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const logAdminAction = async (adminId, action, entity, entityId, details, ip) => {
  await AdminLog.create({ adminId, action, entity, entityId, details, ipAddress: ip });
};

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, customers, providers, bookings, revenue, services] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'provider' }),
    Booking.countDocuments(),
    Booking.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
    Service.countDocuments({ isActive: true }),
  ]);

  const monthlyGrowth = await User.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        users: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const bookingsByStatus = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const servicesByCategory = await Service.aggregate([
    { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $group: { _id: '$category.name', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      customers,
      providers,
      bookings,
      revenue: revenue[0]?.total || 0,
      services,
      monthlyGrowth,
      bookingsByStatus,
      servicesByCategory,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { fullName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');

  await logAdminAction(req.user._id, 'update', 'user', user._id, req.body, req.ip);
  res.json({ success: true, data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  await logAdminAction(req.user._id, 'delete', 'user', user._id, {}, req.ip);
  res.json({ success: true, message: 'User deleted' });
});

const getVerifications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const verifications = await ProviderVerification.find(filter)
    .populate({ path: 'providerId', populate: { path: 'userId', select: 'fullName email phone' } })
    .sort('-createdAt');

  res.json({ success: true, data: verifications });
});

const verifyProvider = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  const verification = await ProviderVerification.findById(req.params.id).populate('providerId');
  if (!verification) throw new ApiError(404, 'Verification not found');

  verification.status = status;
  verification.reviewedBy = req.user._id;
  verification.reviewedAt = new Date();
  if (rejectionReason) verification.rejectionReason = rejectionReason;
  await verification.save();

  const provider = await Provider.findById(verification.providerId._id || verification.providerId);
  if (provider) {
    provider.verificationStatus = status;
    await provider.save();

    await createNotification({
      userId: provider.userId,
      type: NOTIFICATION_TYPES.PROVIDER_APPROVAL,
      title: `Verification ${status}`,
      message: status === 'approved'
        ? 'Your provider account has been verified!'
        : `Verification rejected: ${rejectionReason || 'Please contact support'}`,
      channels: { email: true, sms: true, inApp: true },
    });
  }

  await logAdminAction(req.user._id, 'verify', 'provider', provider?._id, { status }, req.ip);
  res.json({ success: true, message: `Provider ${status}`, data: verification });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('customerId', 'fullName email')
      .populate({ path: 'providerId', populate: { path: 'userId', select: 'fullName' } })
      .populate('serviceId', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: bookings,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const getSettings = asyncHandler(async (req, res) => {
  let settings = await PlatformSettings.findOne();
  if (!settings) settings = await PlatformSettings.create({});
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  let settings = await PlatformSettings.findOne();
  if (!settings) settings = await PlatformSettings.create(req.body);
  else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  await logAdminAction(req.user._id, 'update', 'settings', settings._id, req.body, req.ip);
  res.json({ success: true, data: settings });
});

const getPublicStats = asyncHandler(async (req, res) => {
  const [customers, providers, services, completedJobs] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Provider.countDocuments({ verificationStatus: 'approved' }),
    Service.countDocuments({ isActive: true }),
    Booking.countDocuments({ status: 'completed' }),
  ]);

  res.json({
    success: true,
    data: { totalCustomers: customers, totalProviders: providers, totalServices: services, completedJobs },
  });
});

const generateReport = asyncHandler(async (req, res) => {
  const { type, format = 'pdf' } = req.query;
  let data = [];
  let title = '';

  switch (type) {
    case 'users':
      data = await User.find().select('fullName email role createdAt');
      title = 'Users Report';
      break;
    case 'providers':
      data = await Provider.find().populate('userId', 'fullName email');
      title = 'Providers Report';
      break;
    case 'bookings':
      data = await Booking.find().populate('customerId serviceId', 'fullName name');
      title = 'Bookings Report';
      break;
    case 'revenue':
      data = await Booking.find({ status: 'completed' }).populate('serviceId', 'name');
      title = 'Revenue Report';
      break;
    default:
      throw new ApiError(400, 'Invalid report type');
  }

  if (format === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(title);
    if (data.length > 0) {
      const keys = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
      sheet.addRow(keys);
      data.forEach((item) => {
        const obj = item.toObject ? item.toObject() : item;
        sheet.addRow(keys.map((k) => JSON.stringify(obj[k]) || ''));
      });
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xlsx`);
    await workbook.xlsx.write(res);
    return;
  }

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${type}-report.pdf`);
  doc.pipe(res);
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  data.forEach((item, i) => {
    doc.fontSize(10).text(`${i + 1}. ${JSON.stringify(item.toObject ? item.toObject() : item)}`);
    doc.moveDown(0.5);
  });
  doc.end();

  await logAdminAction(req.user._id, 'report', type, null, { format }, req.ip);
});

module.exports = {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getVerifications,
  verifyProvider,
  getAllBookings,
  getSettings,
  updateSettings,
  getPublicStats,
  generateReport,
};
