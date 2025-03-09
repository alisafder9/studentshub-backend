const express = require('express');
const { body } = require('express-validator');
const StudentController = require('../controllers/studentController');

const router = express.Router();

router.post('/addstudent', [
    body('admission_date').isDate().withMessage('Date of admission is required'),
    body('admission_no').notEmpty().withMessage('Admission number is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('father_name').notEmpty().withMessage('Father name is required'),
    body('dob').isDate().withMessage('Date of birth is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
    body('grade').isIn(['K.G', '1st', '2nd', '3rd', '4th', '5th']).withMessage('Grade is required'),
    body('nationality').isIn(['Pakistani', 'Afghani']).withMessage('Nationality must be either Pakistani or Afghani'),
    body('father_cnic').isLength({ min: 13 }).withMessage('Father CNIC must be at least 13 characters long'),
    body('father_contact').isLength({ min: 11 }).withMessage('Father contact must be at least 11 characters long'),
    body('address').notEmpty().withMessage('Address is required'),
    body('status').isIn(['Active', 'Inactive']).withMessage('Status is required')
],  StudentController.createStudent);

router.get('/allstudents', StudentController.getAllStudents);
router.get('/search', StudentController.searchStudents);

router.put('/:admission_no', [
    body('admission_date').optional().isDate().withMessage('Date of admission is required'),
    body('admission_no').optional().notEmpty().withMessage('Admission number is required'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('father_name').optional().notEmpty().withMessage('Father name is required'),
    body('dob').optional().isDate().withMessage('Date of birth is required'),
    body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
    body('grade').optional().isIn(['K.G', '1st', '2nd', '3rd', '4th', '5th']).withMessage('Grade is required'),
    body('nationality').optional().isIn(['Pakistani', 'Afghani']).withMessage('Nationality must be either Pakistani or Afghani'),
    body('father_cnic').optional().isLength({ min: 13 }).withMessage('Father CNIC must be at least 13 characters long'),
    body('father_contact').optional().isLength({ min: 11 }).withMessage('Father contact must be at least 11 characters long'),
    body('address').optional().notEmpty().withMessage('Address is required'),
    body('status').optional().isIn(['Active', 'Inactive']).withMessage('Status is required')
], StudentController.updateStudent);

router.delete('/:admission_no', StudentController.deleteStudent);

module.exports = router;