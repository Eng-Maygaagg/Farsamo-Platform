const Service = require('../models/Service');
const Category = require('../models/Category');
const Provider = require('../models/Provider');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getServices = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  const filter = { isActive: true };

  if (category) filter.categoryId = category;
  if (search) filter.$text = { $search: search };

  const skip = (page - 1) * limit;
  const [services, total] = await Promise.all([
    Service.find(filter).populate('categoryId', 'name slug icon').sort('name').skip(skip).limit(Number(limit)),
    Service.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: services,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

const getPopularServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true })
    .populate('categoryId', 'name slug icon')
    .limit(6)
    .sort('name');

  res.json({ success: true, data: services });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('categoryId', 'name slug icon description');
  if (!service) throw new ApiError(404, 'Service not found');

  const providers = await Provider.find({
    services: service._id,
    verificationStatus: 'approved',
    isAvailable: true,
  })
    .populate('userId', 'fullName avatar')
    .sort('-rating')
    .limit(5);

  res.json({ success: true, data: { service, suggestedProviders: providers } });
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, data: service });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, message: 'Service deleted' });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder');
  res.json({ success: true, data: categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = {
  getServices,
  getPopularServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
