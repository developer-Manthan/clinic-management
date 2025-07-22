import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import BookAppointment from '../components/BookAppointment';
import ClinicInfo from '../components/ClinicInfo';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/mine');
      setAppointments(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointments');
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

  const handleDelete = async (appointmentId) => {
    const result = await MySwal.fire({
      title: 'Cancel Appointment?',
      text: "Are you sure you want to cancel this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        console.error(error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white shadow-xl rounded-2xl p-6 max-h-[80vh]">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">My Appointments</h2>

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
                  upcomingAppointments.map(a => (
                    <div
                      key={a._id}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 shadow p-4 rounded relative"
                    >
                      <p className="font-semibold">
                        Doctor:{' '}
                        <span className="text-blue-800">
                          {a.doctorId?.name}
                        </span>
                      </p>
                      <p>Date: {a.date}</p>
                      <p>Time: {a.time}</p>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )
              ) : pastAppointments.length === 0 ? (
                <p className="text-gray-600">No past appointments.</p>
              ) : (
                pastAppointments.map(a => (
                  <div
                    key={a._id}
                    className="bg-gray-100 shadow p-4 rounded"
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
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
            <BookAppointment refreshAppointments={fetchAppointments} />
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto sticky top-24">
            <ClinicInfo />
          </div>

        </div>
      </main>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
