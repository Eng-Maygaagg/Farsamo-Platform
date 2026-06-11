const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Farsamo Platform' },
    contactEmail: { type: String, default: 'contact@farsamo.com' },
    contactPhone: { type: String, default: '+252 61 000 0000' },
    address: { type: String, default: 'Mogadishu, Somalia' },
    commissionRate: { type: Number, default: 10, min: 0, max: 100 },
    maintenanceMode: { type: Boolean, default: false },
    stats: {
      totalCustomers: { type: Number, default: 0 },
      totalProviders: { type: Number, default: 0 },
      totalServices: { type: Number, default: 0 },
      completedJobs: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
