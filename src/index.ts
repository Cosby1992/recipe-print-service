import express from "express";
import { recipeRouter } from "./routes/recipe";
import dotenv from 'dotenv';

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
app.use('/recipe', recipeRouter);

app.listen(port, () => {
    console.log(`Server is litening on port: ${port}`);
})