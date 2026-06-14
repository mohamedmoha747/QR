const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const ScanEvent = require('../models/ScanEvent');
const QrCodeModel = require('../models/QrCode');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.get('/overview', protect, asyncHandler(async (req, res) => {
  const qrs = await QrCodeModel.find({ owner: req.user._id, status: 'active' });
  const totalScans = qrs.reduce((sum, qr) => sum + qr.scanCount, 0);
  const totalQrs = qrs.length;
  res.json({ totalQrs, totalScans });
}));

router.get('/events', protect, asyncHandler(async (req, res) => {
  const events = await ScanEvent.find({ qrCode: { $in: req.query.qrIds?.split(',') || [] } }).sort({ createdAt: -1 });
  res.json(events);
}));

module.exports = router;
