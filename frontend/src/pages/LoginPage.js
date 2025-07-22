import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            if (data.clearanceLevel === 1) {
              navigate('/patient-dashboard');
            } else if (data.clearanceLevel === 2) {
                navigate('/doctor-dashboard');
            } else if (data.clearanceLevel === 3) {
                navigate('/admin-dashboard');
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error(error.response.data.message);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded w-96 space-y-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>
      
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
      
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
      
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
      
            <p className="text-sm text-center">
              Don’t have an account?{' '}
              <Link to="/patient-registration" className="text-blue-600 underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      );
      
}
