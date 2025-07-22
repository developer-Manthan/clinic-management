import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function GenerateDoctorSchedulePage() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/users/doctors');
        setDoctors(data);
      } catch (error) {
        console.error(error);
        alert('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const timeOptions = [];
  for (let hour = 8; hour <= 20; hour++) {
    ['00', '30'].forEach(min => {
      if (hour === 20 && min !== '00') return;
      timeOptions.push(`${hour.toString().padStart(2, '0')}:${min}`);
    });
  }

  const toggleTime = (time) => {
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  useEffect(() => {
    const fetchExistingAvailability = async () => {
      if (!doctorId || !date) {
        setSelectedTimes([]);
        return;
      }

      try {
        const { data } = await api.get(`/availability/${doctorId}/${date}`);
        if (data && data.times) {
          setSelectedTimes(data.times);
        } else {
          setSelectedTimes([]);
        }
      } catch (error) {
        console.error(error);
        setSelectedTimes([]);
      }
    };

    fetchExistingAvailability();
  }, [doctorId, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || selectedTimes.length === 0) {
      alert('Please select all fields');
      return;
    }

    try {
      await api.post('/availability', {
        doctorId,
        date,
        times: selectedTimes,
      });
      alert('Schedule generated successfully');
      setDoctorId('');
      setDate('');
      setSelectedTimes([]);
    } catch (error) {
      console.error(error);
      alert('Failed to generate schedule');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Generate Doctor Schedule</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
          className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Select Doctor</option>
          {doctors.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div>
          <p className="mb-2 font-medium text-purple-800">Select Times</p>
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {timeOptions.map(time => (
              <label
                key={time}
                className={`border rounded p-2 text-center cursor-pointer ${
                  selectedTimes.includes(time)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white hover:bg-purple-50'
                }`}
              >
                <input
                  type="checkbox"
                  value={time}
                  checked={selectedTimes.includes(time)}
                  onChange={() => toggleTime(time)}
                  className="hidden"
                />
                {time}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
        >
          Generate Schedule
        </button>
      </form>
    </div>
  );
}
