const express = require('express');
const { createDietChart, getDietCharts, updateDietChart, deleteDietChart } = require('../controllers/dietChartController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware('Manager'), createDietChart);
router.get('/:id', authMiddleware('Manager'), getDietCharts);
router.put('/:id', authMiddleware('Manager'), updateDietChart);
router.delete('/:id', authMiddleware('Manager'), deleteDietChart);

module.exports = router;
