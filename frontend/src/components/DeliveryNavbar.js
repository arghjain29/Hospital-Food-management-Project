import React from "react";
import { useNavigate } from "react-router-dom";

const DeliveryNavbar = () => {
  let navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  }

  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Delivery Dashboard</h1>
        <button onClick={handlelogout} className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
          Logout
        </button>
      </div>
    </header>
  );
};

export default DeliveryNavbar;