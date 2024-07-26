import config from "config";
import logger from '../utils/logger.js';

const API_KEY = config.get('API_KEY');
export const authenticateApiKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey !== API_KEY) {
        const error = 'Forbidden: Invalid API key';
        logger.info({ error });
        return res.status(403).json({ error });
    }

    next();
};
