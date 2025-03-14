// filepath: c:\Users\win10\Downloads\Web Development\React\studentshub-Mongo\studentshub-backend\src\server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log("Server running on port 5000");
});