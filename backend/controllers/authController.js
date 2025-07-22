const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerPatient = async (req, res) => {
  const { name, email, password, phone, address, insuranceProvider, insurancePolicyNumber, paymentMethod } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    clearanceLevel: 1,
    phone,
    address,
    insuranceProvider,
    insurancePolicyNumber,
    paymentMethod,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      clearanceLevel: user.clearanceLevel,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.registerDoctor = async (req, res) => {
  const { name, email, password, specialization, experienceYears } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Doctor already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    clearanceLevel: 2,
    specialization,
    experienceYears,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      clearanceLevel: user.clearanceLevel,
    });
  } else {
    res.status(400).json({ message: 'Invalid doctor data' });
  }
};

exports.registerAdmin = async (req, res) => {
  const { name, email, password, department } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    clearanceLevel: 3,
    department,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      clearanceLevel: user.clearanceLevel,
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      clearanceLevel: user.clearanceLevel,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
