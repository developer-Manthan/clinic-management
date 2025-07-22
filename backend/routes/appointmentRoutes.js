const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
    const { doctorId, date, time } = req.body;

    try {
        const existing = await Appointment.findOne({ doctorId, date, time });
        if (existing) {
            return res.status(400).json({ message: 'This slot is already booked.' });
        }

        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            date,
            time,
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create appointment' });
    }
});

router.get('/mine', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id })
            .populate('patientId', 'name')
            .populate('doctorId', 'name');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
});

router.get('/doctor', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user._id })
            .populate('patientId', 'name')
            .populate('doctorId', 'name');
        res.json(appointments);
    } catch {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
});

router.get('/all', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', 'name')
            .populate('doctorId', 'name');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
