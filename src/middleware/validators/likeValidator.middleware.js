const { body } = require('express-validator');


exports.likeSchema = [
    body('like')
        .exists()
        .withMessage('Title is required')
        .isInt({ min: -1, max: 1 })
        .withMessage('Must be 0, -1 or 1')
];



