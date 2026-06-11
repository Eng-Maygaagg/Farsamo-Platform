const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    basePrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    features: [String],
    estimatedDuration: { type: String, default: '1-2 hours' },
  },
  { timestamps: true }
);

serviceSchema.index({ categoryId: 1, name: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
