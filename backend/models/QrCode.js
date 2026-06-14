const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: [
      'url', 'text', 'contact', 'wifi', 'payment', 'email', 'phone', 'sms', 'location', 'event'
    ],
    required: true,
  },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  dynamic: { type: Boolean, default: false },
  destinationUrl: { type: String },
  shortCode: { type: String, unique: true, sparse: true },
  qrData: { type: String },
  svgData: { type: String },
  pngPath: { type: String },
  logoUrl: { type: String },
  foregroundColor: { type: String, default: '#000000' },
  backgroundColor: { type: String, default: '#ffffff' },
  frame: { type: String, default: 'none' },
  status: { type: String, enum: ['active', 'archived', 'deleted'], default: 'active' },
  privacy: { type: String, enum: ['public', 'private', 'password'], default: 'public' },
  password: { type: String },
  expiresAt: { type: Date },
  oneTime: { type: Boolean, default: false },
  scanCount: { type: Number, default: 0 },
  uniqueScans: { type: Number, default: 0 },
  categories: [{ type: String }],
  tags: [{ type: String }],
  lastScannedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('QrCode', qrSchema);
