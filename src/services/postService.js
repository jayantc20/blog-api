import Post from '../models/post.js';
import { getPostsFromCache, updatePostCache } from '../utils/postCache.js';
import logger from "../utils/logger.js";

const posts = new Map(); // In-memory store for posts

const updateCacheForCreateAsync = async (newPost) => {
    try {
        let cachedBlogs = await getPostsFromCache();
        if (cachedBlogs) {
            cachedBlogs.push(newPost);
        } else {
            cachedBlogs = [newPost];
        }
        await updatePostCache(cachedBlogs);
    } catch (error) {
        logger.error('Failed to update cache after post creation:', error);
    }
};

const updateCacheForUpdateAsync = async (updatedPost) => {
    try {
        let cachedBlogs = await getPostsFromCache();
        if (cachedBlogs) {
            const index = cachedBlogs.findIndex(p => p.id === updatedPost.id);
            if (index !== -1) {
                cachedBlogs[index] = updatedPost;
                await updatePostCache(cachedBlogs);
            }
        }
    } catch (error) {
        logger.error('Failed to update cache after post update:', error);
    }
};

const updateCacheForDeleteAsync = async (id) => {
    try {
        let cachedBlogs = await getPostsFromCache();
        if (cachedBlogs) {
            cachedBlogs = cachedBlogs.filter(p => p.id !== id);
            await updatePostCache(cachedBlogs);
        }
    } catch (error) {
        logger.error('Failed to update cache after post deletion:', error);
    }
};

const createPost = async (title, content) => {
    const id = (posts.size + 1).toString();
    const newPost = new Post(id, title, content);
    posts.set(id, newPost);

    updateCacheForCreateAsync(newPost);

    return newPost;
};

const getPostById = async (id) => {
    return posts.get(id);
};

const getAllPosts = async () => {
    return Array.from(posts.values());
};

const updatePostById = async (id, data) => {
    if (posts.has(id)) {
        const post = posts.get(id);
        post.title = data.title || post.title;
        post.content = data.content || post.content;

        updateCacheForUpdateAsync(post);

        return post;
    }
    return null;
};

const deletePostById = async (id) => {
    if (posts.has(id)) {
        posts.delete(id);

        updateCacheForDeleteAsync(id);

        return true;
    }
    return false;
};

const getPostsWithCache = async (page, limit) => {
    let cachedBlogs = await getPostsFromCache();

    if (!cachedBlogs) {
        cachedBlogs = await getAllPosts();
        await updatePostCache(cachedBlogs);
    }

    const paginatedPosts = cachedBlogs.slice((page - 1) * limit, page * limit);

    return {
        page,
        limit,
        totalPosts: cachedBlogs.length,
        posts: paginatedPosts,
    };
};

export {
    createPost,
    getPostById,
    getAllPosts,
    updatePostById,
    deletePostById,
    getPostsWithCache,
};
