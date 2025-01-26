import express from "express";
import { recipeRouter } from "./routes/recipe";
import { globalErrorHandlerMiddleware } from './middleware/global-error-handler';

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env:', result.error);
}

const app = express();
const port = 3000;

// Body parser
app.use(express.json());

// Attach routes
  app.use(globalErrorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Server is litening on port: ${port}`);
})