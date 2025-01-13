import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";

const BackendUrl = process.env.REACT_APP_BACKEND_URL;


const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dietChart, setDietChart] = useState(null);
  const [showDietModal, setShowDietModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showMealTypeModal, setShowMealTypeModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [mealDetails, setMealDetails] = useState([]);
  const [chartId, setChartId] = useState(null);
  const [showEditChartModal, setShowEditChartModal] = useState(false);
  const [editChartData, setEditChartData] = useState({
    morningMeal: "",
    eveningMeal: "",
    nightMeal: "",
    ingredients: [],
    instructions: "",
  });

  const handleEditChartSubmit = () => {
    try {
      fetch(`${BackendUrl}/api/diet-charts/${chartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(editChartData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Diet chart updated successfully!");
            fetchDietChart(selectedPatient); // Refresh the diet chart
            setShowEditChartModal(false); // Close the modal
          } else {
            console.error("Failed to update diet chart");
          }
        })
    } catch (error) {
      console.error("Error updating diet chart:", error);
      alert("An error occurred while updating the diet chart. Please try again.");
    }
    setShowEditChartModal(false);
  };

  const openMealTypeModal = (patient) => {
    setCurrentPatient(patient);
    setShowMealTypeModal(true);
  };

  const closeMealTypeModal = () => {
    setShowMealTypeModal(false);
    setSelectedMealType('');
  };

  const confirmMealType = async () => {
    if (!selectedMealType) {
      alert("Please select a meal type.");
      return;
    }

    try {
      const response = await fetch(`${BackendUrl}/api/mealtask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          patientId: currentPatient._id,
          mealType: selectedMealType,
        }),
      });

      if (response.ok) {
        alert("Task assigned successfully!");
        closeMealTypeModal();
      } else {
        const errorData = await response.json(); // Parse error response for details
        alert(`Failed to assign task: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("An error occurred while assigning the task. Please try again.");
    }
  };


  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    emergencyContact: "",
    diseases: [],
    allergies: [],
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
  });
  const [newDietChart, setNewDietChart] = useState({
    morningMeal: "",
    eveningMeal: "",
    nightMeal: "",
    ingredients: [],
    instructions: "",
  });



  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await fetch(`${BackendUrl}/api/patients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch diet chart
  const fetchDietChart = async (patientId) => {
    try {
      const response = await fetch(
        `${BackendUrl}/api/diet-charts/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 404) {
        setDietChart(null); // If diet chart not found, set to null
      } else if (response.ok) {
        const data = await response.json();
        setDietChart(data); // Set the diet chart if found
      } else {
        console.error("Error fetching diet chart:", response.statusText);
      }

      setSelectedPatient(patientId);
    } catch (error) {
      console.error("Error fetching diet chart:", error);
    }
  };

  // Add new patient
  const addPatient = async () => {
    try {
      const response = await fetch(`${BackendUrl}/api/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        setShowPatientModal(false);
        setNewPatient({
          name: "",
          age: "",
          gender: "",
          contact: "",
          emergencyContact: "",
          diseases: [],
          allergies: [],
          roomNumber: "",
          bedNumber: "",
          floorNumber: "",
        });
        fetchPatients(); // Refresh the patient list
      } else {
        console.error("Failed to add patient");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };
  // Add new diet chart
  const addDietChart = async () => {
    try {
      const response = await fetch(`${BackendUrl}/api/diet-charts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ ...newDietChart, patientId: selectedPatient }),
      });

      if (response.ok) {
        fetchDietChart(selectedPatient); // Refresh the diet chart
        setShowDietModal(false); // Close the modal
        setNewDietChart({
          morningMeal: "",
          eveningMeal: "",
          nightMeal: "",
          ingredients: [],
          instructions: "",
        }); // Reset the form
      } else {
        console.error("Failed to add diet chart");
      }
    } catch (error) {
      console.error("Error adding diet chart:", error);
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


  useEffect(() => {
    fetchPatients();
    fetchAllmealTask();
  }, []);

  const totalPendingOrAssignedDeliveries = mealDetails.reduce((count, item) => {
    return (item.deliveryStatus === 'pending' || item.deliveryStatus === 'Assigned') ? count + 1 : count;
  }, 0);

  const totalDoneDeliveries = mealDetails.reduce((count, item) => {
    return (item.deliveryStatus === 'done') ? count + 1 : count;
  }, 0);


  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />


      <main className="p-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-extrabold text-green-700 mb-4">
            Welcome, Admin!
          </h2>


          {/* stats card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard title="Total Patients" value={patients.length} color="text-green-600" />
            <StatsCard title="Meals Delivered" value={totalDoneDeliveries} color="text-blue-600" />
            <StatsCard title="Pending Deliveries" value={totalPendingOrAssignedDeliveries} color="text-red-600" />
          </div>


          {/* Two-Box Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Box: Patient List */}
            <div className="bg-white shadow-lg rounded-lg h-96 overflow-y-auto relative">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-green-700">Patients</h3>
                {/* Add New Patient Button */}
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                  onClick={() => setShowPatientModal(true)}
                >
                  Add New Patient
                </button>
              </div>

              {/* Patient List Content */}
              <div className="p-6">
                {patients.length === 0 ? (
                  <p className="text-gray-600">No patients found.</p>
                ) : (
                  patients.map((patient) => (
                    <div
                      key={patient._id}
                      className={`p-4 mb-4 bg-white shadow-sm rounded-lg border hover:shadow-md transition ${selectedPatient === patient._id ? "border-green-600" : ""
                        }`}
                    >
                      <p className="font-medium text-green-700">{patient.name}</p>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">Room: {patient.roomNumber}</p>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          className="text-sm text-blue-600 hover:underline"
                          onClick={() => fetchDietChart(patient._id)}
                        >
                          View Diet Chart
                        </button>
                        <button
                          className="text-sm text-purple-600 hover:underline"
                          onClick={() => openMealTypeModal(patient)}
                        >
                          Assign For Meal Delivery
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Box: Diet Chart */}
            <div className="bg-white shadow-lg rounded-lg h-96 overflow-y-auto relative">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-green-700">Diet Chart</h3>
                {dietChart && (
                  <button
                    onClick={() => {
                      setShowEditChartModal(true);
                      setEditChartData({
                        morningMeal: dietChart.morningMeal || "",
                        eveningMeal: dietChart.eveningMeal || "",
                        nightMeal: dietChart.nightMeal || "",
                        ingredients: dietChart.ingredients?.join(", ") || "",
                        instructions: dietChart.instructions || "",
                      });
                      setChartId(dietChart._id);  // Save chart ID in state
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                  >
                    Edit Chart
                  </button>
                )}
              </div>

              {/* Diet Chart Content */}
              <div className="p-6">
                {selectedPatient ? (
                  dietChart ? (
                    <div>
                      {/* Patient Info */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-green-600">
                          Patient ID: <span className="font-medium">{selectedPatient}</span>
                        </h4>
                      </div>

                      {/* Morning Meal */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-green-600">Morning Meal:</h4>
                        <p className="text-gray-800">{dietChart.morningMeal || "Not specified"}</p>
                      </div>

                      {/* Evening Meal */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-green-600">Evening Meal:</h4>
                        <p className="text-gray-800">{dietChart.eveningMeal || "Not specified"}</p>
                      </div>

                      {/* Night Meal */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-green-600">Night Meal:</h4>
                        <p className="text-gray-800">{dietChart.nightMeal || "Not specified"}</p>
                      </div>

                      {/* Ingredients */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-green-600">Ingredients:</h4>
                        <p className="text-gray-800">{dietChart.ingredients?.join(", ") || "Not specified"}</p>
                      </div>

                      {/* Instructions */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-green-600">Instructions:</h4>
                        <p className="text-gray-800">{dietChart.instructions || "Not specified"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      <p>No diet chart found for this patient.</p>
                      <button
                        onClick={() => setShowDietModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Add Diet Chart
                      </button>
                    </div>
                  )
                ) : (
                  <div className="text-gray-600">
                    <p>Select a patient to show their diet chart.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main >

      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Add New Patient</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPatient();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.contact}
                    onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                    required
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.emergencyContact}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, emergencyContact: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Diseases */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diseases</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2"
                    rows="2"
                    value={newPatient.diseases.join(", ")}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        diseases: e.target.value.split(",").map((disease) => disease.trim()),
                      })
                    }
                    placeholder="Enter diseases separated by commas"
                  />
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2"
                    rows="2"
                    value={newPatient.allergies.join(", ")}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        allergies: e.target.value.split(",").map((allergy) => allergy.trim()),
                      })
                    }
                    placeholder="Enter allergies separated by commas"
                  />
                </div>

                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.roomNumber}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, roomNumber: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Bed Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.bedNumber}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, bedNumber: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Floor Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={newPatient.floorNumber}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, floorNumber: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-lg"
                  onClick={() => setShowPatientModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDietModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Add Diet Chart</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addDietChart();
              }}
            >
              <div className="mb-4">
                <label>Morning Meal</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newDietChart.morningMeal}
                  onChange={(e) =>
                    setNewDietChart({ ...newDietChart, morningMeal: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label>Evening Meal</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newDietChart.eveningMeal}
                  onChange={(e) =>
                    setNewDietChart({ ...newDietChart, eveningMeal: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label>Night Meal</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newDietChart.nightMeal}
                  onChange={(e) =>
                    setNewDietChart({ ...newDietChart, nightMeal: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label>Ingredients</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={newDietChart.ingredients.join(", ")}
                  onChange={(e) =>
                    setNewDietChart({
                      ...newDietChart,
                      ingredients: e.target.value.split(",").map((item) => item.trim()),
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label>Instructions</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={newDietChart.instructions}
                  onChange={(e) =>
                    setNewDietChart({ ...newDietChart, instructions: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowDietModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )
      }

      {
        showMealTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4 text-center">Select Meal Type</h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Meal Type</label>
                <select
                  className="w-full border px-4 py-2 rounded-lg"
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                >
                  <option value="">Select a meal type</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  onClick={closeMealTypeModal}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={confirmMealType}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Chart Modal */}
      {showEditChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-green-700">Edit Diet Chart</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setShowEditChartModal(false)}
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleEditChartSubmit();
              }}
            >
              {/* Morning Meal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Morning Meal
                </label>
                <input
                  type="text"
                  value={editChartData.morningMeal}
                  onChange={(e) =>
                    setEditChartData((prev) => ({
                      ...prev,
                      morningMeal: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                  placeholder="Enter morning meal details"
                />
              </div>

              {/* Evening Meal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evening Meal
                </label>
                <input
                  type="text"
                  value={editChartData.eveningMeal}
                  onChange={(e) =>
                    setEditChartData((prev) => ({
                      ...prev,
                      eveningMeal: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                  placeholder="Enter evening meal details"
                />
              </div>

              {/* Night Meal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Night Meal
                </label>
                <input
                  type="text"
                  value={editChartData.nightMeal}
                  onChange={(e) =>
                    setEditChartData((prev) => ({
                      ...prev,
                      nightMeal: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                  placeholder="Enter night meal details"
                />
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients
                </label>
                <input
                  type="text"
                  value={editChartData.ingredients}
                  onChange={(e) =>
                    setEditChartData((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                  placeholder="Enter ingredients (comma-separated)"
                />
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={editChartData.instructions}
                  onChange={(e) =>
                    setEditChartData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                  placeholder="Enter special instructions"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowEditChartModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div >
  );
};

export default Dashboard;
