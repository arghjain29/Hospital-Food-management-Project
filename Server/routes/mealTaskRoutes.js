const express = require('express');
const { addMealTask, getPendingTask, updateTaskStatus, getAssignedTask, getDPendingTask, markAsDelivered,getAllMealTasks} = require('../controllers/mealTaskController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware('Manager'), addMealTask);
router.get('/pendingTasks', authMiddleware('Pantry'), getPendingTask);
router.put('/:id', authMiddleware('Pantry'), updateTaskStatus);
router.get('/assignedTasks', authMiddleware('Pantry'), getAssignedTask);
router.get('/DpendingTasks', authMiddleware('Delivery'), getDPendingTask);
router.patch('/markAsDelivered/:id', authMiddleware('Delivery'), markAsDelivered);
router.get('/fetchMealTasks', authMiddleware(['Manager', 'Pantry']), getAllMealTasks);
// router.get('/fetchMealTasks', authMiddleware('Pantry'), getAllMealTasks);

module.exports = router;
