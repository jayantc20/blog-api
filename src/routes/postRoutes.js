import { Router } from 'express';
import { authenticateApiKey } from '../middleware/authMiddleware.js';
import {
    createPostController,
    getPostController,
    listPostsController,
    updatePostController,
    deletePostController,
} from '../controllers/postController.js';

import {
    getPostValidator,
    createPostValidator,
    updatePostValidator,
    listPostsValidator,
} from "../validations/postValidators.js";

const postRoutes = Router();

// Create a new blog post
postRoutes.post('/', createPostValidator, createPostController);

// Retrieve a specific blog post
postRoutes.get('/:id', getPostValidator, getPostController);

// List all blog posts with pagination
postRoutes.get('/', listPostsValidator, listPostsController);

// Update a blog post
postRoutes.put('/:id', updatePostValidator, updatePostController);

// Delete a blog post
postRoutes.delete('/:id', authenticateApiKey, deletePostController);

export default postRoutes;
