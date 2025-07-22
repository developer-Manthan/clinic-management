import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import PostAvailability from '../components/PostAvailability';
import ClinicInfo from '../components/ClinicInfo';
import dayjs from 'dayjs';
import { ToastContainer } from 'react-toastify';

export default function DoctorDashboard() {
  const [schedule, setSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await api.get('/appointments/doctor');
        setSchedule(data);
      } catch (error) {
        console.error(error);
        alert('Failed to load schedule');
      }
    };
    fetchSchedule();
  }, []);

  const now = dayjs();

  const upcomingAppointments = schedule.filter(a =>
    dayjs(a.date).isAfter(now, 'hour') || dayjs(a.date).isSame(now, 'hour')
  );

  const pastAppointments = schedule.filter(a =>
    dayjs(a.date).isBefore(now, 'hour')
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <ToastContainer position="bottom-center" />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-lg max-h-[80vh]">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">My Schedule</h1>

            <div className="flex mb-4 border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'upcoming'
                    ? 'border-b-4 border-blue-600 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'past'
                    ? 'border-b-4 border-blue-600 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('past')}
              >
                Past
              </button>
            </div>

            <div className="space-y-2 max-h-[56vh] overflow-y-auto">
              {activeTab === 'upcoming' ? (
                upcomingAppointments.length === 0 ? (
                  <p className="text-gray-600">No upcoming appointments.</p>
                ) : (
                  upcomingAppointments.map(s => (
                    <div key={s._id} className="bg-gradient-to-r from-blue-0 to-blue-50 shadow p-4 rounded">
                      <p className="font-semibold">
                        Patient: <span className="text-blue-800">{s.patientId.name}</span>
                      </p>
                      <p>Date: {s.date}</p>
                      <p>Time: {s.time}</p>
                    </div>
                  ))
                )
              ) : pastAppointments.length === 0 ? (
                <p className="text-gray-600">No past appointments.</p>
              ) : (
                pastAppointments.map(s => (
                  <div key={s._id} className="bg-gradient-to-r from-gray-100 to-gray-200 shadow p-4 rounded">
                    <p className="font-semibold">
                      Patient: <span className="text-gray-800">{s.patientId.name}</span>
                    </p>
                    <p>Date: {s.date}</p>
                    <p>Time: {s.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-lg max-h-[80vh]">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Post Availability</h2>
            <PostAvailability />
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-lg sticky top-24">
            <ClinicInfo />
          </div>

        </div>
      </main>
    </div>
  );
}
