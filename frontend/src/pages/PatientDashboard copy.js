import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import BookAppointment from '../components/BookAppointment';
import ClinicInfo from '../components/ClinicInfo';
import dayjs from 'dayjs';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/mine');
      setAppointments(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const now = dayjs();

  let upcomingAppointments = appointments.filter(a =>
    dayjs(a.date).isSame(now, 'hour')
  );

  const upcomingAppointments1 = appointments.filter(a =>
    dayjs(a.date).isAfter(now, 'hour')
  );

  upcomingAppointments = [...upcomingAppointments, ...upcomingAppointments1];

  const pastAppointments = appointments.filter(a =>
    dayjs(a.date).isBefore(now, 'hour')
  );

  console.log(upcomingAppointments, "upcoming");
  console.log(pastAppointments, "past");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <section className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-2xl flex flex-col h-[calc(100vh-120px)]">
              <h1 className="text-3xl font-bold text-purple-700 mb-4">My Appointments</h1>

              <div className="flex mb-4 border-b">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'upcoming'
                      ? 'border-b-4 border-purple-600 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'past'
                      ? 'border-b-4 border-purple-600 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4">
                {activeTab === 'upcoming' ? (
                  upcomingAppointments.length === 0 ? (
                    <p className="text-gray-600">No upcoming appointments.</p>
                  ) : (
                    upcomingAppointments.map(a => (
                      <div
                        key={a._id}
                        className="bg-gradient-to-r from-purple-100 to-purple-200 shadow p-4 rounded mb-2"
                      >
                        <p className="font-semibold">
                          Doctor:{' '}
                          <span className="text-purple-800">
                            {a.doctorId?.name}
                          </span>
                        </p>
                        <p>Date: {a.date}</p>
                        <p>Time: {a.time}</p>
                      </div>
                    ))
                  )
                ) : pastAppointments.length === 0 ? (
                  <p className="text-gray-600">No past appointments.</p>
                ) : (
                  pastAppointments.map(a => (
                    <div
                      key={a._id}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 shadow p-4 rounded mb-2"
                    >
                      <p className="font-semibold">
                        Doctor:{' '}
                        <span className="text-gray-800">
                          {a.doctorId?.name}
                        </span>
                      </p>
                      <p>Date: {a.date}</p>
                      <p>Time: {a.time}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto">
                <BookAppointment refreshAppointments={fetchAppointments}/>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="sticky top-24">
              <ClinicInfo />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
