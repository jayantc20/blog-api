import {
    createPost, getPostById, getAllPosts, updatePostById, deletePostById, getPostsWithCache,
} from '../services/postService.js';

// Controller to create a new blog post
const createPostController = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const newPost = await createPost(title, content);
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};

// Controller to get a specific blog post by ID
const getPostController = async (req, res, next) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
};

// Controller to list all blog posts with pagination
const listPostsController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const result = await getPostsWithCache(page, limit);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Controller to update a blog post by ID
const updatePostController = async (req, res, next) => {
    try {
        const updatedPost = await updatePostById(req.params.id, req.body);
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// Controller to delete a blog post by ID
const deletePostController = async (req, res, next) => {
    try {
        const result = await deletePostById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export {
    createPostController,
    getPostController,
    listPostsController,
    updatePostController,
    deletePostController,
};
