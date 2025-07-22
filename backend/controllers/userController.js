const User = require('../models/User');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ clearanceLevel: 2 }).select('name email');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};
