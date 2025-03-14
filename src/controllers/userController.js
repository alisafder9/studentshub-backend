const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

class UserController {
    // Register a new user
    static async register(req, res) {
        const { name, email, password, dob } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists, please login" });
            }

            const user = new User({ name, email, password, dob });
            await user.save();
            res.status(201).json({ message: "User registered successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Error registering user", error: error.message });
        }
    }

    // Login a user
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || user.password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token});
        } catch (error) {
            res.status(500).json({ message: "Error logging in", error: error.message });
        }
    }

    // Forgot password
    static async forgotPassword(req, res) {
        const { email, dob } = req.body;

        try {
            const user = await User.findOne({ email, dob });
            //console.log(`${user}`);
            if (!user) {
                return res.status(400).json({ message: "Invalid email or date of birth" });
            }

            // Send the user's password in the response
            res.status(200).json({ message: "Password retrieved successfully", password: user.password });
        } catch (error) {
            res.status(500).json({ message: "Error processing request", error: error.message });
        }
    }

    // Get user's name
    static async getName(req, res) {
        const { email } = req.query;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            res.status(200).json({ name: user.name });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user's name", error: error.message });
        }
    }

    // Get user profile by email
    static async getProfile(req, res) {
        const { email } = req.query;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Return only necessary profile information
            res.status(200).json({
                name: user.name,
                email: user.email,
                password: user.password,
                dob: user.dob
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching user profile", error: error.message });
        }
    }

    // Update user profile (name, password, dob)
    static async updateProfile(req, res) {
        const { email, name, password, dob } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update fields if they are provided in the request
            if (name) user.name = name;
            if (password) user.password = password;
            if (dob) user.dob = dob;

            await user.save();

            res.status(200).json({ message: "Profile updated successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Error updating profile", error: error.message });
        }
    }
}

module.exports = UserController;