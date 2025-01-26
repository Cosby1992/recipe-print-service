import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, durationMs }) => {
  const duration = durationMs ? ` ${durationMs}ms` : '';
  return `[${timestamp}] ${level} ${message}${duration}`;
});

// Create a Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info", // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    colorize({ all: false }), // Only colorize the log level
    logFormat // Format the log output
  ),
  silent: process.env.LOG_LEVEL === "none", // Disable logging if level is 'none'
  transports: [
    new transports.Console(), // Log to console
  ],
});

export default logger;
