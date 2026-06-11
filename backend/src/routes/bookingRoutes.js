const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  trackBooking,
  updateBookingStatus,
  getBookingStats,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingRules } = require('../middleware/validators');
const { ROLES } = require('../config/constants');

router.get('/track/:bookingId', trackBooking);
router.use(protect);
router.get('/stats', getBookingStats);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', authorize(ROLES.CUSTOMER), bookingRules, validate, createBooking);
router.patch('/:id/status', authorize(ROLES.PROVIDER, ROLES.ADMIN, ROLES.CUSTOMER), updateBookingStatus);

module.exports = router;
