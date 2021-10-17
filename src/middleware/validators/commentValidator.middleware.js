const { body } = require('express-validator');


exports.createCommentSchema = [
    body('text')
        .optional()
        .isString()
        .withMessage('Must be a text')
];

exports.updateCommentSchema = [
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

