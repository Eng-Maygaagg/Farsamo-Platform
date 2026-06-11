const crypto = require('crypto');
const User = require('../models/User');
const Provider = require('../models/Provider');
const ProviderVerification = require('../models/ProviderVerification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { createNotification } = require('../services/notificationService');
const { NOTIFICATION_TYPES, ROLES } = require('../config/constants');

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ fullName, email, phone, password, role: ROLES.CUSTOMER });

  await createNotification({
    userId: user._id,
    type: NOTIFICATION_TYPES.REGISTRATION,
    title: 'Welcome to Farsamo!',
    message: 'Your account has been created successfully.',
    channels: { email: true },
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user, accessToken, refreshToken },
  });
});

const registerProvider = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, profession, experience, location, nationalId, profilePhoto } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ fullName, email, phone, password, role: ROLES.PROVIDER, avatar: profilePhoto || '' });

  const provider = await Provider.create({
    userId: user._id,
    profession,
    experience,
    location,
    nationalId,
    profilePhoto: profilePhoto || '',
  });

  await ProviderVerification.create({
    providerId: provider._id,
    nationalIdDocument: nationalId,
    status: 'pending',
  });

  await createNotification({
    userId: user._id,
    type: NOTIFICATION_TYPES.REGISTRATION,
    title: 'Provider Registration Received',
    message: 'Your provider account is pending verification.',
    channels: { email: true, sms: true },
  });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Provider registration successful. Awaiting verification.',
    data: { user, provider, accessToken, refreshToken },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) throw new ApiError(403, 'Account has been deactivated');

  user.lastLogin = new Date();
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  setTokenCookies(res, accessToken, refreshToken);

  let provider = null;
  if (user.role === ROLES.PROVIDER) {
    provider = await Provider.findOne({ userId: user._id });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: { user, provider, accessToken, refreshToken },
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  setTokenCookies(res, accessToken, refreshToken);

  res.json({ success: true, data: { accessToken, refreshToken } });
});

const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({ success: true, message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  let provider = null;
  if (req.user.role === ROLES.PROVIDER) {
    provider = await Provider.findOne({ userId: req.user._id }).populate('services');
  }

  res.json({ success: true, data: { user: req.user, provider } });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: true, message: 'If email exists, reset link has been sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const { sendEmail } = require('../services/emailService');
  await sendEmail(user.email, 'Password Reset', `Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>`);

  res.json({ success: true, message: 'If email exists, reset link has been sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successful' });
});

const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = {
  registerCustomer,
  registerProvider,
  login,
  refreshAccessToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
};
