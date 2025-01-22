import OpenAI from "openai";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export const sendMessageToDeepSeek = async (
  messages: Message[]
): Promise<string> => {
  if (
    !process.env.DEEPSEEK_API_KEY ||
    process.env.DEEPSEEK_API_KEY.length < 10
  ) {
    throw new Error("Missing or invalid DEEPSEEK_API_KEY");
  }
  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY ?? "",
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "deepseek-chat",
    });

    const { content } = completion.choices[0].message;

    if (!content) throw new Error("No content!");

    console.log("content:", content);

    return content;
  } catch (error) {
    console.error("DeepSeek error");
    throw error;
  }
};
