import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

// Padding logic to account for colorized log levels
const padEndColored = (str: string, length: number) => {
  // Strip ANSI color codes to calculate padding correctly
  const strippedStr = str.replace(/\u001b\[[0-9;]*m/g, "");
  const padding = Math.max(length - strippedStr.length, 0);
  return str + " ".repeat(padding);
};

const logFormat = printf(({ level, message, timestamp, durationMs, ...metadata }) => {
  const paddedLevel = padEndColored(level, 5); // Ensure level is padded to 5 characters
  const duration = durationMs ? ` ${durationMs}ms` : "";
  const metaString = Object.keys(metadata).length ? ` | ${JSON.stringify(metadata)}` : "";
  return `[${timestamp}] ${paddedLevel} ${message}${duration}${metaString}`;
});

// Create a Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || "debug", // Default log level
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
    colorize({ all: false }), // Only colorize the log level
    logFormat // Format the log output
  ),
  silent: process.env.LOG_LEVEL === "none", // Disable logging if level is 'none'
  transports: [
    new transports.Console(), // Log to console
  ],
});

export default logger;
