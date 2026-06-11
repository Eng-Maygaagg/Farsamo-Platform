const express = require('express');
const router = express.Router();
const { submitContact, getContactMessages, markContactRead } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contactRules } = require('../middleware/validators');
const { ROLES } = require('../config/constants');

router.post('/', contactRules, validate, submitContact);
router.use(protect, authorize(ROLES.ADMIN));
router.get('/', getContactMessages);
router.patch('/:id/read', markContactRead);

module.exports = router;
