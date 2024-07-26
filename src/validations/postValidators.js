import { body, param, query, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

const createValidator = (validations) => [
    ...validations,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.info(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const createPostValidator = createValidator([
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Title is required'),

    body('content')
        .isString()
        .withMessage('Content must be a string')
        .notEmpty()
        .withMessage('Content is required'),
]);

const updatePostValidator = createValidator([
    param('id')
        .isNumeric()
        .withMessage('Invalid post ID format'),

    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string'),

    body('content')
        .optional()
        .isString()
        .withMessage('Content must be a string'),
]);

const listPostsValidator = createValidator([
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer'),
]);

const getPostValidator = createValidator([
    param('id')
        .isNumeric()
        .withMessage('Invalid post ID format')
]);

export {
    getPostValidator,
    createPostValidator,
    updatePostValidator,
    listPostsValidator,
};
