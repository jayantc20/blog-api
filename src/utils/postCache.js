const CACHE_EXPIRATION_TIME = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_CACHE_SIZE = 100; // Cache Size

let blogCache = {};

export const clearPostCache = async () => {
    blogCache = {}; // Reset cache
};


export const getPostsFromCache = async () => {
    const cachedBlogs = blogCache;

    if (cachedBlogs && isCacheValid(cachedBlogs.timestamp)) {
        return cachedBlogs.data;
    }
    return undefined;
};

export const updatePostCache = async (blogs) => {
    blogCache = {
        data: blogs,
        timestamp: Date.now(),
    };

    enforceCacheSizeLimit();
};

const isCacheValid = (timestamp) => {
    const currentTime = Date.now();
    return currentTime - timestamp < CACHE_EXPIRATION_TIME;
};

const enforceCacheSizeLimit = () => {
    // Check if we need to enforce the size limit
    if (blogCache.data.length > MAX_CACHE_SIZE) {
        // Sort posts by timestamp (newest first)
        blogCache.data.sort((a, b) => b.timestamp - a.timestamp);

        // Keep only the most recent items
        blogCache.data = blogCache.data.slice(0, MAX_CACHE_SIZE);
    }
};

