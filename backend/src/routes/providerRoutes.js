const express = require('express');
const router = express.Router();
const {
  getProviders,
  getTopProviders,
  getProviderById,
  getMyProviderProfile,
  updateProviderProfile,
  updateAvailability,
  getProviderEarnings,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/top', getTopProviders);
router.get('/', getProviders);

router.get('/me/profile', protect, authorize(ROLES.PROVIDER), getMyProviderProfile);
router.put('/me/profile', protect, authorize(ROLES.PROVIDER), updateProviderProfile);
router.put('/me/availability', protect, authorize(ROLES.PROVIDER), updateAvailability);
router.get('/me/earnings', protect, authorize(ROLES.PROVIDER), getProviderEarnings);

router.get('/:id', getProviderById);

module.exports = router;
