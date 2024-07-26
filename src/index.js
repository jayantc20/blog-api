import express from "express";
import helmet from "helmet";
import config from "config";
import rateLimit from "express-rate-limit";
import xss from 'xss-clean';
import compression from "compression";
import { errorHandler } from "./utils/errorHandler.js";
import router from "./routes/index.js";
import logger from "./utils/logger.js";

const app = express();
const port = config.get("PORT");

// Apply middleware
app.use(compression());  // Compress responses for better performance
app.use(helmet());       // Secure the app by setting various HTTP headers
app.use(xss());          // Middleware to sanitize user input

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsers
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Use routes
app.use(router);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});

// Handle termination signals
const handleShutdown = (signal) => () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    try {
        server.close(() => {
            logger.info("Server closed.");
            process.exit(0);
        });
    } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
    }
};

process.on("SIGINT", handleShutdown("SIGINT"));
process.on("SIGTERM", handleShutdown("SIGTERM"));

// Handle errors
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception thrown:", error);
    process.exit(1);
});


export { app, server };
