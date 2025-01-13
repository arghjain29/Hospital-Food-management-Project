import React, { useState, useEffect } from "react";
import PantryNavbar from "../components/PantryNavbar";
import StatsCard from "../components/StatsCard";

const BackendUrl = process.env.REACT_APP_BACKEND_URL

const PantryDashboard = () => {
    const [pendingDeliveries, setPendingDeliveries] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [showPreparedModal, setShowPreparedModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [mealDetails, setMealDetails] = useState([]);
    const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
    const [newDeliveryGuy, setNewDeliveryGuy] = useState({
        name: "",
        email: "",
        password: "",
    });



    const openPreparedModal = (task) => {
        setSelectedTask(task);
        setShowPreparedModal(true);
    };

    const closePreparedModal = () => {
        setShowPreparedModal(false);
        setSelectedTask(null);
        setSelectedDeliveryBoy(null);
    };

    const fetchPendingTasks = async () => {
        try {
            const response = await fetch(`${BackendUrl}/api/mealTask/pendingTasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const tasks = await response.json();
                setAssignedTasks(tasks);
            } else {
                console.error("Failed to fetch pending tasks");
            }
        } catch (error) {
            console.error("Error fetching pending tasks:", error);
        }
    };

    const AssignMeal = async (id, id2) => {
        try {
            const response = await fetch(`${BackendUrl}/api/mealTask/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ deliveryStatus: 'Assigned', deliveryAssignedTo: id2 }),
            });

            if (response.ok) {
                alert("Task assigned successfully");
                fetchPendingTasks();
                fetchAssignedTasks();
            } else {
                console.error("Failed to assign task");
            }
        } catch (error) {
            console.error("Error assigning task:", error);
        }
    };

    const fetchDeliveryBoys = async () => {
        try {
            const response = await fetch(`${BackendUrl}/api/auth/deliveryUsers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const users = await response.json();
                setDeliveryBoys(users);

            } else {
                console.error("Failed to fetch delivery boys");
            }
        } catch (error) {
            console.error("Error fetching delivery boys:", error);
        }
    };

    const fetchAssignedTasks = async () => {
        try {
            const response = await fetch(`${BackendUrl}/api/mealTask/assignedTasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const tasks = await response.json();
                setPendingDeliveries(tasks);
            } else {
                console.error("Failed to fetch assigned tasks");
            }
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
        }
    };

    const fetchAllmealTask = async () => {
        try {
            const response = await fetch(`${BackendUrl}/api/mealTask/fetchMealTasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            const data = await response.json();
            setMealDetails(data);

        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const handleAddDeliveryPersonnel = async () => {
        await fetch(`${BackendUrl}/api/auth/addDeliveryUsers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(newDeliveryGuy),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Delivery personnel added successfully");
                setShowAddDeliveryModal(false); // Close modal
                fetchDeliveryBoys(); // Fetch updated list of delivery
                setNewDeliveryGuy({ name: "", email: "", password: "" }); // Reset form
            })
            .catch((error) => {
                console.error("Error adding delivery personnel:", error);
            });
    };


    const totalDoneDeliveries = mealDetails.reduce((count, item) => {
        return (item.deliveryStatus === 'done') ? count + 1 : count;
    }, 0);


    useEffect(() => {
        fetchPendingTasks();
        fetchDeliveryBoys();
        fetchAssignedTasks();
        fetchAllmealTask();
    }, []);



    return (
        <div className="min-h-screen bg-green-50">
            <PantryNavbar />

            <main className="p-6">
                <div className="container mx-auto">
                    {/* Dashboard Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-extrabold text-green-700">Welcome, Pantry Manager!</h2>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                            onClick={() => setShowAddDeliveryModal(true)}
                        >
                            Add Delivery Personnel
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatsCard title="Assigned Tasks" value={assignedTasks.length} color="text-green-600" />
                        <StatsCard title="Pending Deliveries" value={pendingDeliveries.length} color="text-red-600" />
                        <StatsCard title="Delivered Meals" value={totalDoneDeliveries} color="text-blue-600" />
                    </div>

                    {/* Two-Box Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Box: Assigned Tasks */}
                        <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto">
                            <h3 className="text-xl font-bold text-green-700 mb-4">Assigned Tasks</h3>
                            {assignedTasks.length === 0 ? (
                                <p className="text-gray-600">No tasks assigned yet.</p>
                            ) : (
                                assignedTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className={`p-4 mb-4 bg-white shadow-sm rounded-lg border hover:shadow-md transition ${task.selected ? "border-green-600" : ""}`}>

                                        <h6 className="font-medium text-green-700">PatientID: {task.patientId._id}</h6>
                                        <p className="text-sm text-gray-600">Meal Type: {task.mealType}</p>
                                        <p className="text-sm text-gray-600">Room: {task.patientId.roomNumber}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <button className="text-sm text-blue-600 hover:underline"
                                                onClick={() => openPreparedModal(task)}
                                            >
                                                Mark as Prepared
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Right Box: Delivery Pending */}
                        <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto">
                            <h3 className="text-xl font-bold text-green-700 mb-4">Delivery Pending</h3>
                            {pendingDeliveries.length === 0 ? (
                                <p className="text-gray-600">No pending deliveries.</p>
                            ) : (
                                pendingDeliveries.map((delivery) => (
                                    <div
                                        key={delivery._id}
                                        className={`p-4 mb-4 bg-white shadow-sm rounded-lg border hover:shadow-md transition ${delivery.selected ? "border-red-600" : ""}`}
                                    >
                                        <p className="font-medium text-green-700">Delivery Man ID: {delivery.deliveryAssignedTo}</p>
                                        <p className="text-sm text-gray-600">Patient ID: {delivery.patientId._id}</p>
                                        <p className="text-sm text-gray-600">Meal Type: {delivery.mealType}</p>
                                        <p className="text-sm text-gray-600">Room: {delivery.patientId.roomNumber}</p>
                                        <div className="flex items-center justify-between mt-2">

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </main>


            {/* Prepared Modal */}
            {showPreparedModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold text-green-700 mb-4">
                            Mark Task as Prepared
                        </h3>
                        <div className="h-48 overflow-y-auto">
                            <p className="text-sm text-gray-600">
                                Task ID: <strong>{selectedTask._id}</strong>
                            </p>
                            <p>Patient: <strong>{selectedTask.patientId._id}</strong></p>
                            <p>Meal Type: {selectedTask.mealType}</p>
                            <p>Room: {selectedTask.patientId.roomNumber}</p>
                        </div>

                        {/* Delivery Boys List */}
                        <div className="mt-4">
                            <h4 className="font-bold text-green-700 mb-2">Assign to Delivery Boy</h4>
                            <div className="h-32 overflow-y-auto">
                                {deliveryBoys.length === 0 ? (
                                    <p className="text-sm text-gray-600">No delivery boys available.</p>
                                ) : (
                                    deliveryBoys.map((deliveryBoy) => (
                                        <div
                                            key={deliveryBoy._id}
                                            className={`p-2 mb-2 rounded-lg cursor-pointer flex items-center justify-between transition ${selectedDeliveryBoy && selectedDeliveryBoy._id === deliveryBoy._id
                                                    ? "bg-green-100 border border-green-500 shadow"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                            onClick={() => setSelectedDeliveryBoy(deliveryBoy)}
                                        >
                                            <p className={`text-sm ${selectedDeliveryBoy && selectedDeliveryBoy._id === deliveryBoy._id ? "text-green-700 font-semibold" : "text-gray-700"}`}>
                                                {deliveryBoy.name}
                                            </p>
                                            {selectedDeliveryBoy && selectedDeliveryBoy._id === deliveryBoy._id && (
                                                <span className="text-green-600 font-bold">✔</span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                                onClick={() => {
                                    AssignMeal(selectedTask._id, selectedDeliveryBoy._id);
                                    closePreparedModal();
                                }}
                            >
                                Confirm
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                onClick={closePreparedModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddDeliveryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-xl font-bold text-green-700">Add New Delivery Personnel</h3>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => setShowAddDeliveryModal(false)}
                            >
                                ✖
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            className="mt-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddDeliveryPersonnel();
                            }}
                        >
                            {/* Name Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newDeliveryGuy.name || ""}
                                    onChange={(e) =>
                                        setNewDeliveryGuy((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                                    placeholder="Enter name"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newDeliveryGuy.email || ""}
                                    onChange={(e) =>
                                        setNewDeliveryGuy((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                                    placeholder="Enter email"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={newDeliveryGuy.password || ""}
                                    onChange={(e) =>
                                        setNewDeliveryGuy((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    onClick={() => setShowAddDeliveryModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add Personnel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}




        </div>
    );
};

export default PantryDashboard;