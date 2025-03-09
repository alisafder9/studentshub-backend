// filepath: c:\Users\win10\Downloads\Web Development\React\studentshub-Mongo\studentshub-backend\src\routes\userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/register', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('dob').isDate().withMessage('Date of birth is required')
], UserController.register);

router.post('/login', UserController.login);

router.post('/forgot-password', [
    body('email').notEmpty().withMessage('Email is required'),
    body('dob').notEmpty().withMessage('Date of birth is required')
], UserController.forgotPassword);

router.get('/name', UserController.getName);


module.exports = router;