import express from "express";
import { RecipeRequestDto } from "../dtos/recipe-request.dto";
import { validationMiddleware } from "../middleware/validation";
import { getRecipesFromHtmlWithChatGPT } from "../integration/openai";
import { htmlToText } from "../utils/html-to-text";
import { scaleRecipe } from "../utils/scale-recipe";
import { startTimer } from "../utils/performance-timer";
import { InternalServerError } from "../exceptions/http-error";
import { RecipesResponseDto } from "../dtos/recipe-response.dto";
import { expressAsyncHandler } from "../utils/express-async-handler";

const router = express.Router();

export const recipeRouter = router.post(
  "/extract-from-url",
  validationMiddleware(RecipeRequestDto),
  expressAsyncHandler(async (req, res, next) => {
    const { url, targetPortions } = req.body as RecipeRequestDto;

    const getHtmlTextTimer = startTimer("Call URL and sanitize content");
    const text = await htmlToText(url);
    getHtmlTextTimer.log();

    console.log("Content length: ", text.length);

    if (text.length > 35000)
      throw new InternalServerError([
        `HTML was too large after being sanitized, the request has not been passed to ChatGPT`,
      ]);

    // Send predefined prompt to chatgpt for converting the recepi to json
    const promptTimer = startTimer("Prompt ChatGPT");
    const recipesResponseDto = await getRecipesFromHtmlWithChatGPT(`origin:${url};` + text);
    promptTimer.log();

    if (!recipesResponseDto) {
      throw new InternalServerError([
        "Failed to get or clean response from ChatGPT.",
      ]);
    }

    if (
      !recipesResponseDto.recipes[0].details?.portion_count ||
      !targetPortions ||
      targetPortions === recipesResponseDto.recipes[0].details?.portion_count
    ) {
      // Respond without scaling the recipes
      res.json(recipesResponseDto);
      return;
    }

    // Handle upscale/downscale recipe (portions) eg. 4 portions to 2 portions
    const scaledRecipes = recipesResponseDto.recipes.map((recipe) =>
      scaleRecipe(recipe, targetPortions)
    );

    console.log(
      `Scaled recipe to ${targetPortions} servings from ${recipesResponseDto.recipes[0].details?.portion_count} servings`
    );

    // Respond with scaled recipes
    res.json({ recipes: scaledRecipes } satisfies RecipesResponseDto);
  })
);
