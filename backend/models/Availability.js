const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  times: [{
    type: String,
    required: true,
  }],
}, { timestamps: true });

availabilitySchema.index({ doctorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
