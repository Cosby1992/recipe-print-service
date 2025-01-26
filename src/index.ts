import express from "express";
import { recipeRouter } from "./routes/recipe";
import { requestLogMiddleware } from './middleware/request-log';
import { globalErrorHandlerMiddleware } from './middleware/global-error-handler';

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env:', result.error);
}

const app = express();
const port = 3000;

  app.use(express.json()); // Body parser
  app.use(requestLogMiddleware);

// Attach routes
  app.use(globalErrorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Server is litening on port: ${port}`);
})