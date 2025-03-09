// filepath: c:\Users\win10\Downloads\Web Development\React\studentshub-Mongo\studentshub-backend\src\models\studentModel.js
const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    admission_date: { type: Date},
    admission_no: { type: String, unique: true },
    name: { type: String, required: true },
    father_name: { type: String, required: true },
    dob: { type: Date},
    gender: { type: String, enum: ['Male', 'Female'] },
    grade: { type: String, enum: ['K.G', '1st', '2nd', '3rd', '4th', '5th'] },
    nationality: { type: String, enum: ['Pakistani', 'Afghani'] },
    father_cnic: { type: String, minlength: 13 },
    father_contact: { type: String, minlength: 11 },
    address: { type: String},
    status: { type: String, enum: ['Active', 'Inactive'] },
    slc: { type: String},
    issue_date: { type: Date}
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;