const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Appointment.init();
    console.log('Indexes ensured for Availability collection');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
