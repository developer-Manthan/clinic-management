const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
