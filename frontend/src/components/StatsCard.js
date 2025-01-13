import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      <p className={`text-3xl font-extrabold ${color} mt-2`}>{value}</p>
    </div>
  );
};

export default StatsCard;
