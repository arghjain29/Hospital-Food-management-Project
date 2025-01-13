const express = require('express');
const { register, login, getDeliveryUser, addDeliveryUser } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/deliveryUsers',authMiddleware('Pantry'), getDeliveryUser);
router.post('/addDeliveryUsers',authMiddleware('Pantry'), addDeliveryUser);

module.exports = router;
