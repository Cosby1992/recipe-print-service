import "reflect-metadata";

import dotenv from "dotenv";
// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env:", result.error);
}

import express from "express";
import { recipeRouter } from "./routes/recipe";
import { requestLogMiddleware } from "./middleware/request-log";
import { globalErrorHandlerMiddleware } from "./middleware/global-error-handler";
import logger from "./utils/logger";

function start() {
  logger.profile("API server startup time:");
  logger.info("Initializing API server...");

  const app = express();

  // Middleware: Body Parser
  app.use(express.json());
  logger.debug("[Middleware] Initialized body parser (JSON payloads)");

  // Middleware: Request Logging
  app.use(requestLogMiddleware);
  logger.debug("[Middleware] Initialized request logger");

  // Routes: Recipe
  app.use("/recipe", recipeRouter);
  logger.debug("[Routes] Registered '/recipe' route");

  // Middleware: Global Error Handler
  app.use(globalErrorHandlerMiddleware);
  logger.debug("[Middleware] Registered global error handler");

  const port = parseInt(process.env.API_PORT || "3000", 10);
  const env = process.env.NODE_ENV || "development";

  // Start the server
  app.listen(port, () => {
    logger.info(`API server running in '${env}' mode`);
    logger.info(`API accepting requests on port: ${port}`);
    logger.silly("Ready to transform URLs to JSON! :)");
    logger.profile("API server startup time:");
  });

  // Log unhandled rejections and exceptions
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1); // Exit the process to avoid undefined state
  });
}

start();
