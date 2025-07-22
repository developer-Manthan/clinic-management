import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    return (
        <aside className="w-64 bg-white shadow h-full">
            <div className="p-6 text-blue-600 font-bold text-2xl border-b">
                Menu
            </div>
            <nav className="p-4">
                <ul className="space-y-4">
                    <li>
                        <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/appointments" className="block text-gray-700 hover:text-blue-600">
                            My Appointments
                        </Link>
                    </li>
                    <li>
                        <Link to="/book" className="block text-gray-700 hover:text-blue-600">
                            Book Appointment
                        </Link>
                    </li>
                    {user?.clearanceLevel === 3 && (
                        <>
                            <li>
                                <Link to="/doctor-registration" className="hover:bg-gray-700 p-2 rounded">
                                    Register Doctor
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin-registration" className="hover:bg-gray-700 p-2 rounded">
                                    Register Admin
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
}
