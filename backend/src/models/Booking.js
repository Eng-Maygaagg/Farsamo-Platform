const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../config/constants');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.SUBMITTED,
    },
    price: { type: Number, required: true, min: 0 },
    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    cancellationReason: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
