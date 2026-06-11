const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

adminLogSchema.index({ adminId: 1, createdAt: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);
