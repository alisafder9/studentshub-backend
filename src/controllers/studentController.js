// filepath: c:\Users\win10\Downloads\Web Development\React\studentshub-Mongo\studentshub-backend\src\controllers\studentController.js
const Student = require('../models/studentModel');
const { validationResult } = require('express-validator');

class StudentController {
    // Create a new student record
    static async createStudent(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user.userId;
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        try {
            const { admission_date,
                admission_no,
                name,
                father_name,
                dob,
                gender,
                grade,
                nationality,
                father_cnic,
                father_contact,
                address,
                status,
                slc,
                issue_date,
            } = (req.body);
            const newStudent = {
                admission_date,
                admission_no,
                name,
                father_name,
                dob,
                gender,
                grade,
                nationality,
                father_cnic,
                father_contact,
                address,
                status,
                slc,
                issue_date,
                user: user,  // Associate the student with the authenticated user
            };
            const student = await Student.create(newStudent);
            res.status(201).json({ message: "Student added successfully!", student });
        } catch (error) {
            res.status(400).json({ message: "Error adding student", error: error.message });
        }
    }

    // Get all students
    static async getAllStudents(req, res) {
        try {
            const students = await Student.find({ user: req.user.userId });
            res.status(200).json({ students });
        } catch (error) {
            res.status(500).json({ message: "Error fetching students", error: error.message });
        }
    }

    // Search students by admission number or name
    static async searchStudents(req, res) {
        const { query } = req.query;
        try {
            const students = await Student.find({
                $or: [
                    { admission_no: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } }
                ]
            });
            res.status(200).json({ students });
        } catch (error) {
            res.status(500).json({ message: "Error searching students", error: error.message });
        }
    }

    static async birthCertificate(req, res) {
        const { query } = req.query;

        // Validate the query parameter
        if (!query) {
            return res.status(400).json({ message: "Admission number is required" });
        }

        try {
            // Find the student with an exact admission number match
            const student = await Student.findOne({ admission_no: query });

            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            // Allow update only if user owns this student
            if (student.user.toString() !== req.user.userId) { return res.status(401).send('Not Allowed') };
            // Return the student data
            res.status(200).json({
                name: student.name,
                father_name: student.father_name,
                dob: student.dob,
                admission_no: student.admission_no
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching student", error: error.message });
        }
    }

    // Update student record
    static async updateStudent(req, res) {
        const { admission_no } = req.params;
        try {
            const student = await Student.findOneAndUpdate({ admission_no }, req.body, { new: true });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Allow update only if user owns this note
            if (student.user.toString() !== req.user.userId) { return res.status(401).send('Not Allowed') };

            res.status(200).json({ message: "Student updated successfully!", student });
        } catch (error) {
            res.status(400).json({ message: "Error updating student", error: error.message });
        }
    }

    // Delete student record
    static async deleteStudent(req, res) {
        const { admission_no } = req.params;
        try {
            const student = await Student.findOneAndDelete({ admission_no });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            // Allow update only if user owns this note
            if (student.user.toString() !== req.user.id) { return res.status(401).send('Not Allowed') };
            res.status(200).json({ message: "Student deleted successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting student", error: error.message });
        }
    }
}

module.exports = StudentController;