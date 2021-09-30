const { body } = require('express-validator');


exports.createPostSchema = [
    body('title')
        .exists()
        .withMessage('Title is required')
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 chars long'),
    body('text')
        .optional()
        .isString()
        .withMessage('Must be a text'),
    body('image_url')
        .optional()
        .isString()
        .withMessage('Must be a text')
];

exports.updateUserSchema = [
    body('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 20 })
        .withMessage('Password can contain max 20 characters'),
    body('avatar_url')
        .optional()
        .notEmpty()
        .withMessage('Please provide url')
];

exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];