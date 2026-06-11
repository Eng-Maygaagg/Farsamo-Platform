const express = require('express');
const router = express.Router();
const { createCategory, updateCategory, deleteCategory } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.use(protect, authorize(ROLES.ADMIN));
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
