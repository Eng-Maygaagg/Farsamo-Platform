const express = require('express');
const router = express.Router();
const {
  getServices,
  getPopularServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/categories', getCategories);
router.get('/popular', getPopularServices);
router.get('/', getServices);
router.get('/:id', getServiceById);

router.use(protect, authorize(ROLES.ADMIN));
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
