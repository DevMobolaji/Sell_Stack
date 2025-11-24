import winston from "winston";
import "winston-daily-rotate-file";
import chalk from "chalk";
import { maskAny } from "./mask";
import { LogEvent } from "./types";


const isProd = process.env.NODE_ENV === "production";
const serviceName = process.env.SERVICE_NAME || "api";


// File transport: JSON structured logs
const fileTransport = new winston.transports.DailyRotateFile({
filename: "logs/app-%DATE%.log",
datePattern: "YYYY-MM-DD",
maxSize: "50m",
maxFiles: "30d",
zippedArchive: true,
});


const errorFileTransport = new winston.transports.DailyRotateFile({
filename: "logs/error-%DATE%.log",
datePattern: "YYYY-MM-DD",
level: "error",
maxSize: "50m",
maxFiles: "90d",
zippedArchive: true,
});




// Console format (colored and human-friendly) - dev only
const consoleFormat = winston.format.printf((info) => {
const ts = info.timestamp;
const level = info.level;
const msg = info.message || "";
const meta = info.meta ? ` ${JSON.stringify(info.meta)}` : "";


// If structured request
if (info.action === "REST_REQUEST") {
const method = info.method || "";
const route = info.route || "";
const statusNum: number = Number(info.status);
const duration: number = Number(info.duration);



const methodColor = chalk.cyan(method);
const routeColor = chalk.green(route);
const statusColor = statusNum >= 500 ? chalk.red(statusNum) : statusNum >= 400 ? chalk.yellow(statusNum) : chalk.green(statusNum);
const durColor = duration > 1000 ? chalk.red(`${duration}ms`) : duration > 200 ? chalk.yellow(`${duration}ms`) : chalk.white(`${duration}ms`);


return `${chalk.gray(`[${ts}]`)} ${methodColor} ${routeColor} ${statusColor} - ${durColor}${meta}`;
}


if (info.action === "GRAPHQL_REQUEST") {
const op = info.operation || "";
const dur = info.duration || 0;
return `${chalk.gray(`[${ts}]`)} ${chalk.magenta("GQL")} ${chalk.bold(op)} ${chalk.white(`${dur}ms`)}${meta}`;
}

const levelColorMap: Record<string, (text: string) => string> = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.blue,
  http: chalk.magenta,
  verbose: chalk.cyan,
  debug: chalk.green,
  silly: chalk.white,
};

const colorFn = levelColorMap[level] ?? ((x: string) => x);


return `${chalk.gray(`[${ts}]`)} ${colorFn ? colorFn(level) : level}: ${msg}${meta}`;
});


const logger = winston.createLogger({
level: process.env.LOG_LEVEL || "info",
format: winston.format.combine(
winston.format.timestamp(),
winston.format.errors({ stack: true }),
// keep JSON format for file transports
winston.format.json()
),
defaultMeta: { service: serviceName },
transports: [fileTransport, errorFileTransport],
});


// Add console transport with conditional formatting
logger.add(new winston.transports.Console({
format: isProd
? winston.format.combine(winston.format.timestamp(), winston.format.json())
: winston.format.combine(winston.format.timestamp(), consoleFormat),
}));


// Exported helper to log structured events
export function logEvent(evt: LogEvent) {
const maskedMeta = evt.meta ? maskAny(evt.meta) : undefined;


const payload = {
timestamp: new Date().toISOString(),
...evt,
meta: maskedMeta,
} as any;


// write info-level structured log
if (payload.status && payload.status >= 500) {
logger.error(payload);
} else if (payload.status && payload.status >= 400) {
logger.warn(payload);
} else {
logger.info(payload);
}
}


export default logger;
