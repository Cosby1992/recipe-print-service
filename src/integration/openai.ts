import { plainToInstance } from "class-transformer";
import OpenAI from "openai";
import { RecipesResponseDto } from "../dtos/recipe-response.dto";
import { validate, ValidationError } from "class-validator";

export interface Prompt {
  role: "system" | "user" | "assistant";
  content: string;
}

export const promptChatGPT = async (message: Prompt): Promise<string> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
    throw new Error("Missing or invalid OPENAI_API_KEY");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "",
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [{ role: message.role, content: message.content }],
  });

  const { content } = completion.choices[0].message;

  if (!content) throw new Error("No content!");

  return content;
};

export const getRecipesFromHtmlWithChatGPT = async (
  cleanedHTML: string
): Promise<RecipesResponseDto | undefined> => {
  try {
    const prompt = buildPrompt("user", cleanedHTML);

    const response = await promptChatGPT(prompt);

    if (!response) return;

    const parsed = JSON.parse(response);

    const recipeResponseDto = plainToInstance(RecipesResponseDto, parsed);
    const errors = await validate(recipeResponseDto);

    if (errors.length > 0) {
      logValidationErrors(errors);
      return;
    }

    return recipeResponseDto;
  } catch (error) {
    console.error(error);
  }
};

const logValidationErrors = (errors: ValidationError[]) => {
  if (errors.length > 0) {
    const formatErrors = (validationErrors: any[]): any => {
      return validationErrors.map((error) => {
        const formattedError: any = {
          property: error.property,
          errors: Object.values(error.constraints || {}),
        };
        if (error.children && error.children.length > 0) {
          formattedError.children = formatErrors(error.children);
        }
        return formattedError;
      });
    };

    console.log(JSON.stringify(formatErrors(errors), null, 2));
  }
};

const buildPrompt = (role: Prompt["role"], cleanedHTML: string): Prompt => {
  return {
    role,
    content: `Instructions: Extract recipe details from the cleaned HTML provided below, containing only text, img src, and alt attributes. Use the exact text for extraction. Translate all fields to Danish (da-DK), preserving original meaning and measurements.

Output Format:
Return data in this raw JSON structure as a single string, ready to be parsed by JSON.parse():
{ "recipes": [ { "date": "{{ Date }}", "origin": { "website": "{{ Website URL }}", "domain": "{{ Domain }}" }, "title": "{{ Recipe Title }}", "image": { "url": "{{ Image URL }}", "alt": "{{ Image Alt Text }}" }, "details": { "cooking_time": "{{ Cooking Time }}", "preperation_time": "{{ Preparation Time }}", "portion_count": {{ Portion Count }}, "calories_per_portion": {{ Calories Per Portion }} }, "preparation": { "steps": [ { "index": {{ Step Index }}, "text": "{{ Step Text }}" }, {...} ] }, "ingredients": [ { "amount": {{ Amount }}, "unit": "{{ Unit }}", "name": "{{ Name }}" }, {...} ] }, {...} ] }

Notes:

If no HTML is provided, return { "recipes": [] }.
Set missing fields to null.
Remove numeric values (e.g., "ca. 250 g") from ingredients.name while retaining preparation instructions.
Ensure image.url is a full URL or null.
Include the current date in [Day] [Month] [Year] format.
Adhere strictly to the format, with no output outside the JSON.
Provided Cleaned HTML:
${cleanedHTML}`,
  };
};
