const Availability = require('../models/Availability');

exports.createAvailability = async (req, res) => {
  try {
    const { doctorId, date, times } = req.body;

    let availability = await Availability.findOne({ doctorId, date });

    if (availability) {
      availability.times = Array.from(new Set([...availability.times, ...times]));
      await availability.save();
    } else {
      availability = await Availability.create({ doctorId, date, times });
    }

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create availability' });
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const availability = await Availability.find({ doctorId });
    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
};
