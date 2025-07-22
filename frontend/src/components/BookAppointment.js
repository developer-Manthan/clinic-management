import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BookAppointment({ refreshAppointments }) {
  const [availability, setAvailability] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await api.get('/availability');
        setAvailability(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load availability');
      }
    };
    fetchAvailability();
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.warn('Please select all fields');
      return;
    }

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
      });
      toast.success('Appointment booked successfully');
      if (refreshAppointments){
        refreshAppointments();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment');
    }
  };

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);

    const dates = availability
      .filter(a => a.doctorId._id === doctorId)
      .map(a => a.date);

    setAvailableDates(dates);
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 shadow-xl p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Book New Appointment</h2>

      <select
        className="w-full p-3 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        value={selectedDoctor}
        onChange={(e) => handleDoctorChange(e.target.value)}
      >
        <option value="">Select Doctor</option>
        {availability
          .map(a => a.doctorId)
          .filter((doctor, index, self) =>
            index === self.findIndex(p => p._id === doctor._id)
          )
          .map(doctor => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </option>
          ))}
      </select>

      <select
        className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 ${
          !selectedDoctor
            ? 'bg-gray-100 cursor-not-allowed border-gray-300'
            : 'border-green-300 focus:ring-green-400'
        }`}
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setSelectedTime('');
        }}
        disabled={!selectedDoctor}
      >
        <option value="">Select Date</option>
        {availableDates.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      <select
        className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 ${
          !selectedDate
            ? 'bg-gray-100 cursor-not-allowed border-gray-300'
            : 'border-green-300 focus:ring-green-400'
        }`}
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        disabled={!selectedDate}
      >
        <option value="">Select Time</option>
        {availability
          .find(a => a.doctorId._id === selectedDoctor && a.date === selectedDate)
          ?.times.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
      </select>

      <button
        className="bg-green-600 text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        onClick={handleBook}
      >
        Book Appointment
      </button>
    </div>
  );
}
