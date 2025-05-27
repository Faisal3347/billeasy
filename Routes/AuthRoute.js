// AuthRoute.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Model/Auth.js';
import authMiddleware from '../Middleware/AuthMiddleware.js'


const router = express.Router();

// @route   POST /signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({ token ,message:"User Login Succesfully"});
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/logout',authMiddleware, (req, res) => {
  res.status(200).json({ message: 'User logged out successfully' });
});


export default router;
