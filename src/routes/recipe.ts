import express from "express";
import { RecipeRequestDto } from "../dtos/recipe-request.dto";
import { validationMiddleware } from "../middleware/validation";
import { getRecipesFromHtmlWithChatGPT } from "../integration/openai";
import { htmlToText } from "../utils/html-to-text";
import { scaleRecipe } from "../utils/scale-recipe";
import { InternalServerError } from "../exceptions/http-error";
import { RecipesResponseDto } from "../dtos/recipe-response.dto";
import { expressAsyncHandler } from "../utils/express-async-handler";
import logger from "../utils/logger";

const routeName = "/extract-from-url";
const router = express.Router();
const maxSanitizedContentLength = 35000; // chars

export const recipeRouter = router.post(
  routeName,
  validationMiddleware(RecipeRequestDto),
  expressAsyncHandler(async (req, res, _next) => {
    // RecipeRequestDto is validated in middleware so casting is safe
    const { url, targetPortions } = req.body as RecipeRequestDto;

    logger
      .debug("Received recipe extraction request.", {
        url,
        targetPortions,
      })
      .profile("Fetch and sanitize HTML from url took:", { level: "debug" });

    const text = await htmlToText(url);
    logger.profile("Fetch and sanitize HTML from url took:", {
      level: "debug",
    });

    logger.debug("Sanitized HTML content fetched.", {
      contentLength: text.length,
    });

    if (text.length > maxSanitizedContentLength) {
      logger.error("HTML content is too large after sanitization.", {
        contentLength: text.length,
        maxSanitizedContentLength,
      });

      throw new InternalServerError([
        `HTML was too large after being sanitized, the request has not been passed to ChatGPT`,
      ]);
    }

    // Send predefined prompt to chatgpt for converting the recepi to json
    logger
      .debug("Promting OpenAI")
      .profile("OpenAI response took:", { level: "debug" });
    const recipesResponseDto = await getRecipesFromHtmlWithChatGPT(
      `origin:${url};` + text
    );
    logger.profile("OpenAI response took:", { level: "debug" });

    if (!recipesResponseDto) {
      logger.error("Failed to get a valid response from ChatGPT.", { url });
      throw new InternalServerError([
        "Failed to get or clean response from ChatGPT.",
      ]);
    }

    logger.debug(
      `Successfully extracted ${recipesResponseDto.recipes.length} recipe${
        recipesResponseDto.recipes.length === 1 ? "" : "s"
      }`
    );

    if (
      !recipesResponseDto.recipes[0].details?.portion_count ||
      !targetPortions ||
      targetPortions === recipesResponseDto.recipes[0].details?.portion_count
    ) {
      logger.debug("No scaling required or possible for the recipe.");
      // Respond without scaling the recipes
      res.json(recipesResponseDto);
      return;
    }

    // Handle upscale/downscale recipe (portions) eg. 4 portions to 2 portions
    const scaledRecipes = recipesResponseDto.recipes.map((recipe) =>
      scaleRecipe(recipe, targetPortions)
    );

    logger.debug(
      `Scaled recipe to ${targetPortions} servings from ${recipesResponseDto.recipes[0].details?.portion_count} servings`
    );

    // Respond with scaled recipes
    res.json({ recipes: scaledRecipes } satisfies RecipesResponseDto);
  })
);
