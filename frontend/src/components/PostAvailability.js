import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostAvailability() {
  const [date, setDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const doctorId = user?._id;

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

  const handleSubmit = async () => {
    if (!date || selectedTimes.length === 0) {
      toast.error('Please select date and times');
      return;
    }

    try {
      await api.post('/availability', { doctorId, date, times: selectedTimes });
      toast.success('Availability posted successfully');
      setDate('');
      setSelectedTimes([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to post availability');
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 shadow-xl p-6 rounded-2xl mt-6">
      <input
        type="date"
        min={today}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-3 border border-green-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <div>
        <p className="mb-2 font-medium text-green-800">Select Times</p>
        <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto">
          {timeOptions.map(time => (
            <label
              key={time}
              className={`border rounded p-2 text-center cursor-pointer ${
                selectedTimes.includes(time)
                  ? 'bg-green-600 text-white'
                  : 'bg-white hover:bg-green-50'
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
        className="bg-green-600 text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition mt-4"
        onClick={handleSubmit}
      >
        Post Availability
      </button>
    </div>
  );
}
