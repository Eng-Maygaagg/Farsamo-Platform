const mongoose = require('mongoose');
const { VERIFICATION_STATUS } = require('../config/constants');

const providerVerificationSchema = new mongoose.Schema(
  {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    nationalIdDocument: { type: String, required: true },
    certificates: [{ name: String, url: String }],
    profileReviewNotes: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderVerification', providerVerificationSchema);
