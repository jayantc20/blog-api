import winston from "winston";
import config from "config";

const nodeEnv = config.get("NODE_ENV");

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    // Check if message is an object and serialize it
    const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
    return `${timestamp} [${level}]: ${formattedMessage}`;
});

const logger = winston.createLogger({
    level: nodeEnv === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

// If the environment is development, log to the console with colorized output
if (nodeEnv !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
    );
}

export default logger;
