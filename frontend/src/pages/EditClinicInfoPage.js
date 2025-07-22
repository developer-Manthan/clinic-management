import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function EditClinicInfoPage() {
  const [clinicInfo, setClinicInfo] = useState({
    name: '',
    logoUrl: '',
    about: '',
    services: '',
    address: '',
    phone: '',
    emergencyContact: '',
    operatingHours: '',
    insurancePartners: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const { data } = await api.get('/clinic/info');
        setClinicInfo({
          ...data,
          services: data.services.join(', '),
          insurancePartners: data.insurancePartners.join(', '),
        });
      } catch (error) {
        console.error('Failed to fetch clinic info:', error.response?.data?.message || error.message);
      }
    };
    fetchClinicInfo();
  }, []);

  const handleChange = (e) => {
    setClinicInfo({ ...clinicInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/clinic/info', {
        ...clinicInfo,
        services: clinicInfo.services.split(',').map(s => s.trim()),
        insurancePartners: clinicInfo.insurancePartners.split(',').map(p => p.trim()),
      });
      alert('Clinic information updated successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to update clinic info');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center">Edit Clinic Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={clinicInfo.name} onChange={handleChange} placeholder="Clinic Name" className="w-full p-2 border rounded" />
        <input name="logoUrl" value={clinicInfo.logoUrl} onChange={handleChange} placeholder="Logo URL" className="w-full p-2 border rounded" />
        <textarea name="about" value={clinicInfo.about} onChange={handleChange} placeholder="About" className="w-full p-2 border rounded" />

        <input name="services" value={clinicInfo.services} onChange={handleChange} placeholder="Services (comma separated)" className="w-full p-2 border rounded" />

        <input name="operatingHours" value={clinicInfo.operatingHours} onChange={handleChange} placeholder="Operating Hours" className="w-full p-2 border rounded" />

        <input name="address" value={clinicInfo.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />

        <input name="phone" value={clinicInfo.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />

        <input name="emergencyContact" value={clinicInfo.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" className="w-full p-2 border rounded" />

        <input name="insurancePartners" value={clinicInfo.insurancePartners} onChange={handleChange} placeholder="Insurance Partners (comma separated)" className="w-full p-2 border rounded" />

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Update</button>
      </form>
    </div>
  );
}
