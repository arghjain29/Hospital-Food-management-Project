const express = require('express');
const { getPatients, addPatient } = require('../controllers/patientController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware('Manager'), getPatients);
router.post('/', authMiddleware('Manager'), addPatient);

module.exports = router;
