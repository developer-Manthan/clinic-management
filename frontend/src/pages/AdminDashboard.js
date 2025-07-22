import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ClinicInfo from '../components/ClinicInfo';

export default function AdminDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedulesData = await api.get('/appointments/all');
        const patientsData = await api.get('/patients');
        setSchedules(schedulesData.data);
        setPatients(patientsData.data);
      } catch (error) {
        console.error(error);
        alert('Failed to load admin data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-lg max-h-[80vh] flex flex-col">
            <h1 className="text-3xl font-bold text-blue-700 mb-4 flex-shrink-0">All Schedules</h1>
            <div className="overflow-y-auto">
              {schedules.length === 0 ? (
                <p className="text-gray-600">No schedules available.</p>
              ) : (
                schedules.map(s => (
                  <div key={s._id} className="bg-gradient-to-r from-blue-50 to-blue-100 shadow p-4 rounded mb-2">
                    <p className="font-semibold">Doctor: <span className="text-blue-800">{s.doctorId.name}</span></p>
                    <p>Patient: {s.patientId.name}</p>
                    <p>Date: {s.date}</p>
                    <p>Time: {s.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-lg max-h-[80vh] flex flex-col">
            <h1 className="text-3xl font-bold text-green-700 mb-4 flex-shrink-0">Patient History</h1>
            <div className="overflow-y-auto">
              {patients.length === 0 ? (
                <p className="text-gray-600">No patients found.</p>
              ) : (
                patients.map(p => (
                  <div key={p._id} className="bg-gradient-to-r from-green-100 to-green-200 shadow p-4 rounded mb-2">
                    <p className="font-semibold">Name: <span className="text-green-800">{p.name}</span></p>
                    <p>Email: {p.email}</p>
                    <p>Payment Method: {p.paymentMethod || 'N/A'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-6 rounded-lg sticky top-24 max-h-[80vh] overflow-y-auto">
            <ClinicInfo />
          </div>

        </div>
      </main>
    </div>
  );
}
