const mongoose = require('mongoose');
const { REVIEW_STATUS } = require('../config/constants');

const reviewSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
    },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: { type: Date },
  },
  { timestamps: true }
);

reviewSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model('Review', reviewSchema);
