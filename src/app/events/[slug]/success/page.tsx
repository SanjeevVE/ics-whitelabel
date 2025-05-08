'use client';
import { useEffect, useState } from 'react';

// Define the interface for the form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  tshirtSize: string;
}

const SuccessPage = () => {
  // Use the defined type for the formData state
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('registrationData');
    if (storedData) {
      setFormData(JSON.parse(storedData)); // Safe to parse and assign to formData
    }
  }, []);

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Thank You for Registering!</h1>
      <p className="mt-4">Here are your registration details:</p>
      <ul className="mt-2">
        <li>Name: {formData.name}</li>
        <li>Email: {formData.email}</li>
        <li>Phone: {formData.phone}</li>
        <li>Age: {formData.age}</li>
        <li>Gender: {formData.gender}</li>
        <li>T-Shirt Size: {formData.tshirtSize}</li>
      </ul>
    </div>
  );
};

export default SuccessPage;
