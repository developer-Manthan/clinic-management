const ClinicInfo = require('../models/ClinicInfo');

exports.getClinicInfo = async (req, res) => {
  try {
    const info = await ClinicInfo.findOne();
    if (!info) {
      return res.status(404).json({ message: 'Clinic information not found' });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateClinicInfo = async (req, res) => {
  try {
    let info = await ClinicInfo.findOne();

    if (!info) {
      info = await ClinicInfo.create(req.body);
    } else {
      await ClinicInfo.updateOne({ _id: info._id }, req.body);
      info = await ClinicInfo.findById(info._id);
    }

    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
