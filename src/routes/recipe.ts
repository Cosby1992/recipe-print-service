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
    const html = await getHTML(url);

    if (!html) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpStatusMessages[HttpStatus.BAD_REQUEST],
        status: HttpStatus.BAD_REQUEST,
        errors: [`Failed to get html from: "${url}"`],
      } satisfies ErrorResponse);
      return;
    }

    // Send predefined prompt to chat gpt for converting the recepi to json

    // Handle upscale/downscale recipe (portions) eg. 4 portions to 2 portions

    // return json dto with portions, ingredients, preparing steps, etc..

    res.json({ "hot": "damn"});
  }
);

const getHTML = async (url: string): Promise<string | void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return;
    }

    const body = await response.text();

    return body.includes("<html") ? body : undefined;
  } catch (error) {
    console.log(error);
  }
};
