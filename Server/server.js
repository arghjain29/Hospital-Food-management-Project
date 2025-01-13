const express = require('express');
const connectDB = require('./db');
require('dotenv').config();
const cors = require('cors');

connectDB();

const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Replace with your frontend domain
    optionsSuccessStatus: 200 // For legacy browsers
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running....');
    
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/diet-charts', require('./routes/dietChartRoutes'));
app.use('/api/mealTask', require('./routes/mealTaskRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
