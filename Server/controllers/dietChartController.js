const DietChart = require('../models/diet');

// Create a new diet chart
exports.createDietChart = async (req, res) => {
    try {
        const dietChart = new DietChart(req.body);
        await dietChart.save();
        res.status(201).json(dietChart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all diet charts
exports.getDietCharts = async (req, res) => {
    try {
      const dietCharts = await DietChart.findOne({ patientId: req.params.id }).populate('patientId');
      if (!dietCharts) {
        return res.status(404).json({ message: 'Diet chart not found for this patient.' });
      }
      res.json(dietCharts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Update a diet chart
exports.updateDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dietChart) return res.status(404).json({ message: 'Diet chart not found' });
        res.json(dietChart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a diet chart
exports.deleteDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart.findByIdAndDelete(req.params.id);
        if (!dietChart) return res.status(404).json({ message: 'Diet chart not found' });
        res.json({ message: 'Diet chart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
