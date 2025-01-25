import express from "express";
import { RecipeRequestDto } from "../dtos/recipe-request.dto";
import { validationMiddleware } from "../middleware/validation";
import { HttpStatus, HttpStatusMessages } from "../constants/http-status";
import { ErrorResponse } from "../dtos/error-response.dto";
import { Message, sendMessageToDeepSeek } from "../integration/deepseek";
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

    const cleanedHtml = cleanHTML(html);

    // Send predefined prompt to chat deepseek for converting the recepi to json
    let messages: Message[] = [];

    const content = await sendMessageToDeepSeek(messages);
  
    console.log("content:", content);
    console.log("done!");

    // Handle upscale/downscale recipe (portions) eg. 4 portions to 2 portions

    // return json dto with portions, ingredients, preparing steps, etc..

    res.json({ hot: content });
  }
);

const getHTML = async (url: string): Promise<string | void> => {
  try {
    const response = await fetch(url);
    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("text/html")
    ) {
      return;
    }

    const body = await response.text();

    return body.includes("<html") ? body : undefined;
  } catch (error) {
    console.log(error);
  }
};

function cleanHTML(inputHTML: string): string {
  // Remove unnecessary whitespace, line breaks, and tabs
  let cleanedHTML = inputHTML.replace(/\s+/g, " ").trim();

  // Remove all comments
  cleanedHTML = cleanedHTML.replace(/<!--[\s\S]*?-->/g, "");

  // Remove all <style> tags and their content
  cleanedHTML = cleanedHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Remove all <script> tags and their content
  cleanedHTML = cleanedHTML.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  // Remove all <path> tags and their content
  cleanedHTML = cleanedHTML.replace(/<path[^>]*>[\s\S]*?<\/path>/gi, "");
  // Remove all <svg> tags and their content
  cleanedHTML = cleanedHTML.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "");
  // Remove all <svg> tags and their content
  cleanedHTML = cleanedHTML.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "");

  // Remove inline styles (styles within the "style" attribute)
  cleanedHTML = cleanedHTML.replace(/\s*style="[^"]*"/gi, "");

  // Remove inline JavaScript event handlers like onclick, onload, etc.
  cleanedHTML = cleanedHTML.replace(/\s*(on\w+\s*=\s*[^>]*\s*)/gi, "");

  // Remove unwanted tags while keeping <img src> and visible content tags
  cleanedHTML = cleanedHTML.replace(
    /<(?!img[^>]*src|br|hr|p|div|span|h[1-6])[^>]+>/gi,
    ""
  );

  // Remove empty tags (those that remain after removing non-visible content)
  cleanedHTML = cleanedHTML.replace(
    /<([a-z][a-z0-9]*)\s*[^>]*>[\s]*<\/\1>/gi,
    ""
  );

  // Remove elements like headers, footers, and navs explicitly
  cleanedHTML = cleanedHTML.replace(
    /<(header|footer|nav|aside)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );


