import express from "express";
import { RecipeRequestDto } from "../dtos/recipe-request.dto";
import { validationMiddleware } from "../middleware/validation";
import { HttpStatus, HttpStatusMessages } from "../constants/http-status";
import { ErrorResponse } from "../dtos/error-response.dto";
const router = express.Router();

// Attach middleware specific to this router here if necessary

export const recipeRouter = router.post(
  "/extract-from-url",
  validationMiddleware(RecipeRequestDto),
  async (req, res) => {
    const { url, targetPortions } = req.body as RecipeRequestDto;

    // call and "verify" provided url and store html in mem

    // Send predefined prompt to chat gpt for converting the recepi to json

    // Handle upscale/downscale recipe (portions) eg. 4 portions to 2 portions

    // return json dto with portions, ingredients, preparing steps, etc..

  }
);
