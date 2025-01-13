import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeliveryNavbar from '../components/DeliveryNavbar'

const DeliveryDashboard = () => {
    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const BackendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchAssignedDeliveries = async () => {
        try {
            const response = await fetch(`${BackendUrl}/api/mealTask/DpendingTasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const deliveries = await response.json();
                setAssignedDeliveries(deliveries);
            } else {
                console.error("Failed to fetch assigned deliveries");
            }
        } catch (error) {
            console.error("Error fetching assigned deliveries:", error);
        }
    };

    const markAsDelivered = async (taskId) => {
        try {
            const response = await fetch(`${BackendUrl}/api/mealTask/markAsDelivered/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
    
            if (response.ok) {
                const updatedTask = await response.json();
                setAssignedDeliveries((prevDeliveries) =>
                    prevDeliveries.map((delivery) =>
                        delivery._id === updatedTask._id ? updatedTask : delivery
                    )
                );
                fetchAssignedDeliveries();
            } else {
                console.error("Failed to update delivery status");
            }
        } catch (error) {
            console.error("Error updating delivery status:", error);
        }
    };

    useEffect(() => {
        fetchAssignedDeliveries();
    }, []);

    return (
        <div className="min-h-screen bg-green-50">
            <DeliveryNavbar />

            <main className="p-6">
                <div className="container mx-auto">
                    {/* Dashboard Title */}
                    <h2 className="text-2xl font-extrabold text-green-700 mb-4">Delivery Man Dashboard</h2>

                    {/* Assigned Meal Boxes */}
                    <div className="bg-white shadow-lg rounded-lg p-6 h-[470px] overflow-y-auto">
                        <h3 className="text-xl font-bold text-green-700 mb-4">Assigned Meal Boxes</h3>
                        {assignedDeliveries.length === 0 ? (
                            <p className="text-gray-600">No deliveries assigned yet.</p>
                        ) : (
                            assignedDeliveries.map((delivery) => (
                                <div
                                    key={delivery._id}
                                    className={`p-4 mb-4 bg-white shadow-sm rounded-lg border hover:shadow-md transition ${delivery.deliveryStatus === "done" ? "border-green-600" : ""}`}
                                >
                                    <h6 className="font-medium text-green-700 mb-2">Patient ID: {delivery.patientId._id}</h6>
                                    <h6 className="font-medium text-green-700 mb-2">Patient Name: {delivery.patientId.name}</h6>
                                    <p className="text-sm text-gray-600 mb-2">Meal Type: {delivery.mealType}</p>

                                    {/* Highlighted Location Details */}
                                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-2">
                                        <p className="text-sm text-green-800 font-medium">Location Details:</p>
                                        <p className="text-sm text-gray-700">Room: {delivery.patientId.roomNumber}</p>
                                        <p className="text-sm text-gray-700">Floor: {delivery.patientId.floorNumber}</p>
                                        <p className="text-sm text-gray-700">Bed Number: {delivery.patientId.bedNumber}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm text-gray-600">Status: {delivery.deliveryStatus}</p>

                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        onClick={() => markAsDelivered(delivery._id)}
                                        >
                                            Mark as Done
                                        </button>

                                        {delivery.deliveryStatus === "done" && (
                                            <span className="text-sm text-green-600">Delivery Completed</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div >
            </main >
        </div >
    );
};


export default DeliveryDashboard
