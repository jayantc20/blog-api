import config from "config";
import logger from "./logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    const isProduction = config.get("NODE_ENV") === "production";

    if (isProduction) {
        res.status(500).json({ error: "Internal Server Error" });
    } else {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};
