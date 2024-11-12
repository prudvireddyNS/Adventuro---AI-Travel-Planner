const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User")

const signup = async (req, res) => {
    try {
        const { name, username, email, phoneNumber, password } = req.body;
        
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists, you can login',
                success: false
            });
        }

        // Create a new user instance
        const newUser = new UserModel({ name, username, email, phoneNumber, password });
        
        // Hash the password before saving
        newUser.password = await bcrypt.hash(password, 10);
        
        // Save the new user to the database
        await newUser.save();
        
        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: newUser.email, _id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            jwtToken,
            message: "Signup successfully",
            success: true
        });
    } catch (err) {
        console.error(err);  // Log error for debugging
        res.status(500).json({
            message: "Internal server error",
            error: err.message, // Include error message for debugging
            success: false
        });
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed: email or password is incorrect';

        // If user not found
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // Compare provided password with the stored hashed password
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // Generate JWT token for the user
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        console.error(err);  // Log error for debugging
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

module.exports = {
    signup,
    signin
}
