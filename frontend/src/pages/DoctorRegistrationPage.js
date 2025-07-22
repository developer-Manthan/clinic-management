import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function DoctorRegistrationPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/register-doctor', data);
            alert('Doctor registered successfully');
            navigate('/admin-dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow p-6 rounded w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center">Doctor Registration</h2>

                <input {...register('name', { required: true })} placeholder="Name" className="w-full p-2 border rounded" />
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

                <input {...register('email', { required: true })} placeholder="Email" className="w-full p-2 border rounded" />
                {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

                <input type="password" {...register('password', { required: true, minLength: 6 })} placeholder="Password" className="w-full p-2 border rounded" />
                {errors.password && <p className="text-red-500 text-sm">Password must be at least 6 characters</p>}

                <input {...register('specialization')} placeholder="Specialization" className="w-full p-2 border rounded" />

                <input {...register('experienceYears')} placeholder="Years of Experience" type="number" className="w-full p-2 border rounded" />

                <button type="submit" className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700">Register Doctor</button>
            </form>
        </div>
    );
}