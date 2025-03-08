// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(express.json());
app.use(cors());

// Register Route
const { body, validationResult } = require('express-validator');
app.post('/register', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('dob').isDate().withMessage('Date of birth is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, dob } = req.body;

    // Check if the user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Error checking user existence" });
        if (user) return res.status(400).json({ message: "User already exists, please login" });

        // If user does not exist, proceed with registration
        db.run('INSERT INTO users (name, email, password, dob) VALUES (?, ?, ?, ?)', [name, email, password, dob], function (err) {
            if (err) return res.status(500).json({ message: "Error registering user" });
            res.status(200).json({ message: "User registered successfully!" });
        });
    });
});

// Login Route
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) return res.status(401).json({ message: "Invalid credentials" });

        if (password !== user.password) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, email });
    });
});

// Forgot Password Route
app.post('/forgot-password', [
    body('email').notEmpty().withMessage('Email is required'),
    body('dob').notEmpty().withMessage('Date of birth is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, dob } = req.body;

    // Query the database to find the user with the correct email and dob
    db.get('SELECT * FROM users WHERE email = ? AND dob = ?', [email, dob], (err, user) => {
        if (err || !user) return res.status(400).json({ success: false, message: "Invalid email or date of birth" });

        // If user is found, retrieve the user's password in plain text
        const userPassword = user.password;  // Assuming `password` column exists in the `users` table

        // Send the success response with the password
        res.status(200).json({ success: true, message: "Password retrieved successfully", password: userPassword });
    });
});

// Create student record
const moment = require('moment');
app.post('/students', [
    body('admission_date').isDate().withMessage('Date of admission is required'),
    body('admission_no').notEmpty().withMessage('Admission number is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('father_name').notEmpty().withMessage('Father name is required'),
    body('dob').isDate().withMessage('Date of birth is required'),
    body('gender').isIn(['Male', 'Female']).notEmpty().withMessage('Gender must be either Male or Female'),
    body('grade').isIn(['K.G', '1st', '2nd', '3rd', '4th', '5th',]).notEmpty().withMessage('Grade is required'),
    body('nationality').isIn(['Pakistani', 'Afghani']).notEmpty().withMessage('Nationality must be either Pakistani or Afghani'),
    body('father_cnic').isLength({ min: 13 }).notEmpty().withMessage('Father CNIC is required'),
    body('father_contact').isLength({ min: 11 }).notEmpty().withMessage('Father contact is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('status').isIn(['Active', 'Inactive']).notEmpty().withMessage('Status is required'),
     body('admission_date').custom((value, { req }) => {
        const admissionDate = moment(value);
        const dob = moment(req.body.dob);
        const today = moment().startOf('day');

        if (admissionDate.isSame(today) || dob.isSame(today)) {
            throw new Error('Admission date and date of birth cannot be today');
        }

        if (admissionDate.isSame(dob)) {
            throw new Error('Admission date and date of birth cannot be the same');
        }

        if (admissionDate.year() <= dob.year()) {
            throw new Error('Admission date year must be greater than date of birth year');
        }

        return true;
    })
], (req, res) => {
    //console.log('Received request to add student:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { admission_date, admission_no, name, father_name, dob, gender, grade, nationality, father_cnic, father_contact, address, status, slc, issue_date } = req.body;

    // Check if admission_no already exists
    db.get('SELECT * FROM students WHERE admission_no = ?', [admission_no], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (row) {
            return res.status(400).json({ message: 'Admission number already exists' });
        }

        // Insert new student into the database
        db.run('INSERT INTO students (admission_date, admission_no, name, father_name, dob, gender, grade, nationality, father_cnic, father_contact, address, status, slc, issue_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [admission_date, admission_no, name, father_name, dob, gender, grade, nationality, father_cnic, father_contact, address, status, slc, issue_date], function (err) {
                if (err) return res.status(400).json({ message: "Error adding student" });
            });
        res.status(200).json({ message: "Student added successfully!" });
    });
});

// Get all students
app.get('/students', (req, res) => {
    db.all('SELECT admission_date, admission_no, name, father_name, dob, gender, grade, nationality, father_cnic, father_contact, address, status, slc, issue_date FROM students', [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Error fetching students" });
        res.status(200).json({ students: rows });
    });
});

app.get('/user/name', (req, res) => {

    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    db.get('SELECT name FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Error fetching user name" });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ name: user.name });
    });
});

// Search students by admission number or name
app.get('/students/search', (req, res) => {
    const { query } = req.query;
    db.all('SELECT admission_date, admission_no, name, father_name, dob, gender, grade, nationality, father_cnic, father_contact, address, status, slc, issue_date FROM students WHERE admission_no LIKE ? OR name LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.status(500).json({ message: "Error searching students" });
        res.status(200).json({ students: rows });
    });
});

// Update student record
app.put('/students/:admission_no', [
    body('admission_date').optional().isDate().withMessage('Date of admission is required'),
    body('admission_no').optional().notEmpty().withMessage('Admission number is required'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('father_name').optional().notEmpty().withMessage('Father name is required'),
    body('dob').optional().isDate().withMessage('Date of birth is required'),
    body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
    body('grade').optional().isIn(['K.G', '1st', '2nd', '3rd', '4th', '5th']).withMessage('Grade is required'),
    body('nationality').optional().isIn(['Pakistani', 'Afghani']).withMessage('Nationality must be either Pakistani or Afghani'),
    body('father_cnic').optional().isLength({ min: 13 }).withMessage('Father CNIC is required'),
    body('father_contact').optional().isLength({ min: 11 }).withMessage('Father contact is required'),
    body('address').optional().notEmpty().withMessage('Address is required'),
    body('status').optional().isIn(['Active', 'Inactive']).withMessage('Status is required'),
    body('slc').optional().notEmpty().withMessage('SLC is required'),
    body('issue_date').optional().isDate().withMessage('Date of leaving is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { admission_no } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);

    db.run(`UPDATE students SET ${fields} WHERE admission_no = ?`, [...values, admission_no], function (err) {
        if (err) return res.status(500).json({ message: "Error updating student" });
        if (this.changes === 0) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student updated successfully!" });
    });
});

// Delete student record
app.delete('/students/:admission_no', (req, res) => {
    const { admission_no } = req.params;

    db.run('DELETE FROM students WHERE admission_no = ?', [admission_no], function (err) {
        if (err) return res.status(500).json({ message: "Error deleting student" });
        if (this.changes === 0) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully!" });
    });
});

// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
