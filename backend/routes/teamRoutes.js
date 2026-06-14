const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Team = require('../models/Team');
const User = require('../models/User');
const router = express.Router();

router.use(protect);

router.post('/', asyncHandler(async (req, res) => {
  const { name, members } = req.body;
  const team = await Team.create({ name, owner: req.user._id, members: [req.user._id, ...(members || [])] });
  await User.updateMany({ _id: { $in: team.members } }, { team: team._id });
  res.status(201).json(team);
}));

router.get('/', asyncHandler(async (req, res) => {
  const teams = await Team.find({ members: req.user._id }).populate('members', 'name email');
  res.json(teams);
}));

module.exports = router;
