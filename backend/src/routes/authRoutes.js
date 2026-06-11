const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  registerCustomer,
  registerProvider,
  login,
  refreshAccessToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerCustomerRules, registerProviderRules, loginRules } = require('../middleware/validators');

router.post('/register/customer', registerCustomerRules, validate, registerCustomer);
router.post('/register/provider', registerProviderRules, validate, registerProvider);
router.post('/login', loginRules, validate, login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', body('password').isLength({ min: 6 }), validate, resetPassword);
router.put('/update-password', protect, updatePassword);

module.exports = router;
