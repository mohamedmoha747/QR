const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const QrCodeModel = require('../models/QrCode');
const ScanEvent = require('../models/ScanEvent');
const router = express.Router();

router.use(protect, admin);

router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
}));

router.get('/qrs', asyncHandler(async (req, res) => {
  const qrs = await QrCodeModel.find().populate('owner', 'name email');
  res.json(qrs);
}));

router.get('/analytics', asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalQrs = await QrCodeModel.countDocuments();
  const totalScans = await ScanEvent.countDocuments();
  res.json({ totalUsers, totalQrs, totalScans });
}));

module.exports = router;
