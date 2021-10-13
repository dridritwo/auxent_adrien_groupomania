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
        .custom((value, { req }) => value.substring(0, 4) === "http" || !value.length)
        .withMessage("Il faut une url")
];

exports.updatePostSchema = [
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

