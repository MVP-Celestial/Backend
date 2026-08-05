import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  // Use a currently supported model. If this model is not enabled for your
  // Google AI project, choose one listed in Google AI Studio for your API key.
  model: "gemini-3.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi() {
  try {
    const response = await model.invoke("What is the best anime of all time answer in 100 words?");
    console.log(response.content ?? response.text);
  } catch (error) {
    console.error("Gemini request failed:", error.message);
  }
}
