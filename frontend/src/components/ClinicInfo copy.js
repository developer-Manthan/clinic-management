import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ClinicInfoTest() {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const { data } = await api.get('/clinic/info');
        setClinicInfo(data);
      } catch (error) {
        console.error('Failed to fetch clinic info:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicInfo();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl shadow-xl animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
        <div className="h-24 bg-gray-300 rounded mx-auto w-24"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!clinicInfo) {
    return <p className="text-center py-4 text-red-600">Clinic information not available.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-extrabold text-center text-purple-800">{clinicInfo.name}</h1>

      {clinicInfo.logoUrl && (
        <div className="flex justify-center">
          <img src={clinicInfo.logoUrl} alt="Clinic Logo" className="h-24 rounded-full border-4 border-purple-300 shadow-lg" />
        </div>
      )}

      <p className="text-center text-gray-700 text-lg">{clinicInfo.about}</p>

      <div>
        <h2 className="text-2xl font-semibold text-purple-700 mb-2">Services Offered</h2>
        {clinicInfo.services.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {clinicInfo.services.map((service, index) => (
              <li key={index} className="text-gray-800">{service}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No services listed.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-purple-700 mb-2">Operating Hours</h2>
        <p className="text-gray-800">{clinicInfo.operatingHours || 'Not specified'}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-purple-700 mb-2">Contact Us</h2>
        <p className="text-gray-800">{clinicInfo.address}</p>
        <p className="text-gray-800">Phone: {clinicInfo.phone}</p>
        <p className="text-gray-800">Emergency: {clinicInfo.emergencyContact}</p>
      </div>

      {clinicInfo.insurancePartners?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">Insurance Partners</h2>
          <ul className="list-disc list-inside space-y-1">
            {clinicInfo.insurancePartners.map((partner, index) => (
              <li key={index} className="text-gray-800">{partner}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
