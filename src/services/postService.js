import Post from '../models/post.js';
import { getPostsFromCache, updatePostCache } from '../utils/postCache.js';
// import { v4 as uuidv4 } from 'uuid';

const posts = new Map(); // In-memory store for posts

const createPost = async (title, content) => {
    // const id = uuidv4(); // Generate a unique UUID
    const id = (posts.size + 1).toString();
    const newPost = new Post(id, title, content);
    posts.set(id, newPost);

    // Fetch current cache
    let cachedBlogs = await getPostsFromCache();

    if (cachedBlogs) {
        cachedBlogs.push(newPost);
    } else {
        cachedBlogs = [newPost];
    }

    // Update the cache with the new data
    await updatePostCache(cachedBlogs);

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

        // Update cache after modifying a post
        let cachedBlogs = await getPostsFromCache();
        if (cachedBlogs) {
            const index = cachedBlogs.findIndex(p => p.id === id);
            if (index !== -1) {
                cachedBlogs[index] = post;
                await updatePostCache(cachedBlogs);
            }
        }

        return post;
    }
    return null;
};

const deletePostById = async (id) => {
    if (posts.has(id)) {
        posts.delete(id);

        // Update cache after deleting a post
        let cachedBlogs = await getPostsFromCache();
        if (cachedBlogs) {
            cachedBlogs = cachedBlogs.filter(p => p.id !== id);
            await updatePostCache(cachedBlogs);
        }

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
