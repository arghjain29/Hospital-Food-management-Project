const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.json({ token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDeliveryUser = async (req, res) => {
    try {
        const users = await User.find({ role: 'Delivery' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addDeliveryUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password, role: 'Delivery' });
        await user.save();
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};