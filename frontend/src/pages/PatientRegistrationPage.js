import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function PatientRegistrationPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register-patient', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/patient-dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl p-10 rounded-2xl w-full max-w-4xl space-y-6"
      >
        <h2 className="text-4xl font-bold text-center text-blue-700">Patient Registration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              {...register('name', { required: true })}
              placeholder="Full Name"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
          </div>

          <div>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Email"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
          </div>

          <div>
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              placeholder="Password"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>}
          </div>

          <div>
            <input
              type="tel"
              {...register('phone')}
              placeholder="Phone"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="tel"
            />
          </div>

          <div>
            <input
              {...register('address')}
              placeholder="Address"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="street-address"
            />
          </div>

          <div>
            <select
              {...register('paymentMethod', { required: true })}
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Insurance">Insurance</option>
              <option value="Credit Card">Credit Card</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">Payment Method is required</p>}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-inner space-y-4">
          <h3 className="text-xl font-semibold text-blue-700">Insurance Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register('insuranceProvider')}
              placeholder="Insurance Provider"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              {...register('insurancePolicyNumber')}
              placeholder="Insurance Policy Number"
              className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-full hover:bg-blue-800 shadow-lg transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already registered?{' '}
          <span
            className="text-blue-700 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
