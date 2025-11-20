import morgan from "morgan";
import logger from "./logger";

// Create a writable stream for Morgan to pipe logs to Winston
const morganStream = {
    write: (message: string) => {
        // Remove trailing newline from Morgan message
        logger.info(message.trim());
    },
};

// Optional: custom Morgan format
const morganFormat = ":remote-addr - :method :url :status :res[content-length] - :response-time ms";

export const httpLogger = morgan(morganFormat, { stream: morganStream });
