const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { createAvailability, getDoctorAvailability } = require('../controllers/availabilityController');

router.post('/', protect, authorizeRoles(2, 3), async (req, res) => {
    const { date, times, doctorId: bodyDoctorId } = req.body;

    let doctorId;

    if (req.user.clearanceLevel === 2) {
        doctorId = req.user._id;
    } else if (req.user.clearanceLevel === 3) {
        if (!bodyDoctorId) {
            return res.status(400).json({ message: 'doctorId is required when admin creates availability' });
        }
        doctorId = bodyDoctorId;
    } else {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const availability = await Availability.findOneAndUpdate(
            { doctorId, date },
            { doctorId, date, times },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create/update availability' });
    }
});

router.get('/', protect, authorizeRoles(1, 3), async (req, res) => {
    try {
      const allAvailability = await Availability.find().populate('doctorId', 'name');
      const allAppointments = await Appointment.find();
  
      const response = allAvailability
        .map(av => {

          const bookedTimes = allAppointments
            .filter(appt =>
              appt.doctorId.toString() === av.doctorId._id.toString() &&
              appt.date === av.date
            )
            .map(appt => appt.time);
  
          const availableTimes = av.times.filter(time => !bookedTimes.includes(time));
  
          return availableTimes.length > 0 ? {
            _id: av._id,
            doctorId: av.doctorId,
            date: av.date,
            times: availableTimes,
          } : null;
        })
        .filter(entry => entry !== null);
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch availability' });
    }
  });

router.get('/:doctorId', protect, getDoctorAvailability);

router.get('/:doctorId/:date', protect, async (req, res) => {
    const { doctorId, date } = req.params;

    try {
        const availability = await Availability.findOne({ doctorId, date });

        if (!availability) {
            return res.json({ doctorId, date, times: [] });
        }

        res.json({
            doctorId: availability.doctorId,
            date: availability.date,
            times: availability.times,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch availability' });
    }
});

module.exports = router;
