const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  clearanceLevel: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1=Patient, 2=Doctor, 3=Admin
    default: 1
  },

  phone: {
    type: String
  },

  address: {
    type: String
  },

  insuranceProvider: {
    type: String
  },

  insurancePolicyNumber: {
    type: String
  },

  paymentMethod: {
    type: String,
    enum: ['Cash', 'Insurance', 'Credit Card'],
  },

  specialization: {
    type: String
  },

  experienceYears: {
    type: Number
  },

  availability: [{
    day: { type: String },
    from: { type: String },
    to: { type: String }
  }],

  department: {
    type: String
  }

}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
