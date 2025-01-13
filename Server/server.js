const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
// app.use(cors());

app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/diet-charts', require('./routes/dietChartRoutes'));
app.use('/api/mealTask', require('./routes/mealTaskRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
