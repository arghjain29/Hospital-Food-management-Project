const MealTask = require('../models/mealTask');
const router = require('../routes/authRoutes');


// Add new meal data
exports.addMealTask = async (req, res) => {
    try {
        const mealTask = new MealTask(req.body);
        await mealTask.save();
        res.status(201).json(mealTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllMealTasks = async (req, res) => {
    try {
        const tasks = await MealTask.find().populate("patientId");
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks." });
    }
};



// Get all tasks with deliveryStatus = 'pending'
exports.getPendingTask = async (req, res) => {
    try {
        const tasks = await MealTask.find({ deliveryStatus: "pending" }).populate("patientId");
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching pending tasks:", error);
        res.status(500).json({ message: "Error fetching pending tasks." });
    }
};

exports.getAssignedTask = async (req, res) => {
    try {
        const tasks = await MealTask.find({ deliveryStatus: "Assigned" }).populate("patientId");
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching assigned tasks:", error);
        res.status(500).json({ message: "Error fetching assigned tasks." });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const data = await MealTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: 'Task not found' });
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getDPendingTask = async (req, res) => {
    try {
        const userID = req.user.id;
        
        const tasks = await MealTask.find({ 
            deliveryStatus: 'Assigned',
            deliveryAssignedTo: userID  
        }).populate('patientId');
        res.status(200).json(tasks);
        
    } catch (error) {
        console.error("Error fetching pending tasks:", error);
        res.status(500).json({ message: "Error fetching pending tasks." });
    }
};

exports.markAsDelivered = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await MealTask.findByIdAndUpdate(
            id,
            { deliveryStatus: "done" },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating delivery status:", error);
        res.status(500).json({ message: "Error updating delivery status." });
    }
};