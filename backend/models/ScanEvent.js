const mongoose = require('mongoose');

const scanEventSchema = new mongoose.Schema({
  qrCode: { type: mongoose.Schema.Types.ObjectId, ref: 'QrCode', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  ipAddress: { type: String },
  userAgent: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String },
  country: { type: String },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  referrer: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScanEvent', scanEventSchema);
