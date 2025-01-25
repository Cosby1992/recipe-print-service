import OpenAI from "openai";

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
