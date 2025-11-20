import winston from "winston";
import 'winston-mongodb';

const { combine, timestamp, printf, json } = winston.format;

// Optional: Custom format for console
const consoleFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        json() // structured logs
    ),
    transports: [
        // Log errors to file
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),

        // Log all events to file
        new winston.transports.File({ filename: "logs/combined.log" }),

        // Log all events to MongoDB (audit_logs collection)
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: "audit_logs",
            level: "info",
            options: { useUnifiedTopology: true },
        }),

        // Console log for dev environment
        new winston.transports.Console({
            format: consoleFormat,
        }),
    ],
});

export default logger;
