const { body } = require('express-validator');


exports.createCommentSchema = [
    body('text')
        .optional()
        .isString()
        .withMessage('Must be a text')
];



