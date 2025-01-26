import 'reflect-metadata';
import express from "express";
import { recipeRouter } from "./routes/recipe";
import dotenv from "dotenv";
import { requestLogMiddleware } from './middleware/request-log';
import { globalErrorHandlerMiddleware } from './middleware/global-error-handler';

function start() {
  // Load environment variables
  const result = dotenv.config();
  if (result.error) {
    console.error("Error loading .env:", result.error);
  }
  
  const app = express();
  
  app.use(express.json()); // Body parser
  app.use(requestLogMiddleware);
  
  // Attach routes
  app.use("/recipe", recipeRouter);
  app.use(globalErrorHandlerMiddleware);

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is litening on port: ${port}`);
  });
}

start();
