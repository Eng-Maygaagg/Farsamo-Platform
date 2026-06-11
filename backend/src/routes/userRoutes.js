const express = require('express');
const router = express.Router();
const { updateProfile, getCustomerDashboard } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.use(protect);
router.put('/profile', updateProfile);
router.get('/dashboard', authorize(ROLES.CUSTOMER), getCustomerDashboard);

module.exports = router;
