import "reflect-metadata";
import { config } from "./config/config-loader";
import express from "express";
import { recipeRouter } from "./routes/recipe";
import { requestLogMiddleware } from "./middleware/request-log";
import { HttpErrorHandlerMiddleware } from "./middleware/http-error-handler";
import logger from "./utils/logger";

function start() {
  logger.profile("API Started in:").info("Initializing API...");

  const app = express();

  // Middleware: Body Parser
  app.use(express.json());
  logger.debug("Registered body parser");

  // Middleware: Request Logging
  app.use(requestLogMiddleware);
  logger.debug("Registered request logger");

  // Routes: Recipe
  app.use("/recipe", recipeRouter);
  logger.debug("Registered '/recipe' controller");

  // Middleware: Global Error Handler
  // Global error handler must be registered after everything else
  app.use(HttpErrorHandlerMiddleware);
  logger.debug("Registered global error handler");

  // Start the server
  app.listen(config.port, () => {
    logger
      .info(`API running in '${config.env}' mode`)
      .info(`Accepting requests on port: ${config.port}`)
      .profile("API Started in:");
  });
}

start();
