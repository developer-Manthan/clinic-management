import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/register', data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            if (res.data.clearanceLevel === 1) {
                navigate('/patient-dashboard');
            } else if (res.data.clearanceLevel === 2) {
                navigate('/doctor-dashboard');
            } else if (res.data.clearanceLevel === 3) {
                navigate('/admin-dashboard');
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow p-6 rounded w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center">Register</h2>

                <input {...register('name', { required: true })} placeholder="Name" className="w-full p-2 border rounded" />
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

                <input {...register('email', { required: true })} placeholder="Email" className="w-full p-2 border rounded" />
                {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

                <input type="password" {...register('password', { required: true, minLength: 6 })} placeholder="Password" className="w-full p-2 border rounded" />
                {errors.password && <p className="text-red-500 text-sm">Password must be at least 6 characters</p>}

                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Register</button>
            </form>
        </div>
    );
}
