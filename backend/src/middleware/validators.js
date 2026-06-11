const { body, param, query } = require('express-validator');

const registerCustomerRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerProviderRules = [
  ...registerCustomerRules,
  body('profession').trim().notEmpty().withMessage('Profession is required'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number').toInt(),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('nationalId').trim().notEmpty().withMessage('National ID is required'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const bookingRules = [
  body('providerId').notEmpty().withMessage('Provider is required'),
  body('serviceId').notEmpty().withMessage('Service is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').trim().notEmpty().withMessage('Time is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

const reviewRules = [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

module.exports = {
  registerCustomerRules,
  registerProviderRules,
  loginRules,
  bookingRules,
  reviewRules,
  contactRules,
};
