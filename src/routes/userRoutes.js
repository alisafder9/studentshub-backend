const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const authenticateUser = require('../middleware/fetchuser');

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

// New endpoint to fetch user profile by email
router.get('/profile', authenticateUser, UserController.getProfile);

// New endpoint to update user profile (name, password, dob)
router.put('/profile', [
    body('email').notEmpty().withMessage('Email is required'),
    body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('dob').optional().isDate().withMessage('Date of birth must be a valid date')
], UserController.updateProfile);

module.exports = router;