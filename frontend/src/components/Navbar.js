import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-green-50 to-green-100 bg-opacity-80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
      <div
        className="text-2xl font-extrabold text-green-700 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        🏥 Clinic Management
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">
            {user.name || user.email}
          </span>
        )}

        {user && user.clearanceLevel === 3 && (
          <span className="border-l border-green-300 h-6 mx-2"></span>
        )}

        {user && user.clearanceLevel === 3 && (
          <button
            className="text-green-700 hover:text-green-900 font-medium"
            onClick={() => navigate('/doctor-registration')}
          >
            Doctor Registration
          </button>
        )}

        {user && user.clearanceLevel === 3 && (
          <button
            className="text-green-700 hover:text-green-900 font-medium"
            onClick={() => navigate('/admin-registration')}
          >
            Admin Registration
          </button>
        )}

        {user && user.clearanceLevel === 3 && (
          <button
            className="text-green-700 hover:text-green-900 font-medium"
            onClick={() => navigate('/generate-schedule')}
          >
            Generate Schedule
          </button>
        )}

        {user && user.clearanceLevel === 3 && (
          <button
            className="text-green-700 hover:text-green-900 font-medium"
            onClick={() => navigate('/edit-clinic-info')}
          >
            Edit Clinic Details
          </button>
        )}

        <button
          className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 shadow"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
