const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/stats/public', getPublicStats);

router.use(protect, authorize(ROLES.ADMIN));
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/verifications', getVerifications);
router.patch('/verifications/:id', verifyProvider);
router.get('/bookings', getAllBookings);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/reports', generateReport);

module.exports = router;
