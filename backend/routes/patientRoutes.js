const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');

router.get('/', protect, authorizeRoles(3), async (req, res) => {
  try {
    const patients = await User.find({ clearanceLevel: 1 }).select('-password');
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
