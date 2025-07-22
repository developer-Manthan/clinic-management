const mongoose = require('mongoose');

const clinicInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: String,
  about: String,
  services: [String],
  address: String,
  phone: String,
  emergencyContact: String,
  operatingHours: String,
  insurancePartners: [String],
}, { timestamps: true });

module.exports = mongoose.model('ClinicInfo', clinicInfoSchema);
