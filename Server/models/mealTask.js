const mongoose = require('mongoose');

const mealTaskSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    mealType: { type: String, required: true }, // 'morning', 'evening', 'night'
    deliveryAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Assigned delivery personnel
    deliveryStatus: { type: String, default: "pending" }, // Pending,Assigned, Done
});

const MealTask = mongoose.model("MealTask", mealTaskSchema);
module.exports = MealTask;
