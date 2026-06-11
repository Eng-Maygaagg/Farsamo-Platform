const express = require('express');
const router = express.Router();
const { createReview, getReviews, moderateReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewRules } = require('../middleware/validators');
const { ROLES } = require('../config/constants');

router.get('/', getReviews);
router.use(protect);
router.post('/', authorize(ROLES.CUSTOMER), reviewRules, validate, createReview);
router.patch('/:id/moderate', authorize(ROLES.ADMIN), moderateReview);
router.delete('/:id', authorize(ROLES.ADMIN), deleteReview);

module.exports = router;
