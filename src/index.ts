import "reflect-metadata";
import { config } from "./config/config";
import express from "express";
import { recipeRouter } from "./routes/recipe";
import { requestLogMiddleware } from "./middleware/request-log";
import { globalErrorHandlerMiddleware } from "./middleware/global-error-handler";
import logger from "./utils/logger";

function start() {
  logger.profile("API Started in:").info("Initializing API...");

  const app = express();

  // Middleware: Body Parser
  app.use(express.json());
  logger.debug("Registered body parser (JSON payloads)");

  // Middleware: Request Logging
  app.use(requestLogMiddleware);
  logger.debug("Registered request logger");

  // Routes: Recipe
  app.use("/recipe", recipeRouter);
  logger.debug("Registered '/recipe' route");

  // Middleware: Global Error Handler
  // Global error handler must be registered after everything else
  app.use(globalErrorHandlerMiddleware);
  logger.debug("Registered global error handler");

  // Start the server
  app.listen(config.port, () => {
    logger
      .info(`API server running in '${config.env}' mode`)
      .info(`API accepting requests on port: ${config.port}`)
      .profile("API Started in:");
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
