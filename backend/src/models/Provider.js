const mongoose = require('mongoose');
const { VERIFICATION_STATUS } = require('../config/constants');

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    slots: [{ start: String, end: String, isAvailable: { type: Boolean, default: true } }],
  },
  { _id: false }
);

const providerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profession: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    bio: { type: String, default: '', maxlength: 1000 },
    nationalId: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    pricing: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        price: { type: Number, min: 0 },
        unit: { type: String, default: 'per job' },
      },
    ],
    certifications: [{ name: String, url: String, issuedAt: Date }],
    availability: [availabilitySchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

providerSchema.index({ profession: 1, location: 1, rating: -1 });

module.exports = mongoose.model('Provider', providerSchema);
