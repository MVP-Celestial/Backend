import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const geminiModel = new ChatGoogleGenerativeAI({
  // Use a currently supported model. If this model is not enabled for your
  // Google AI project, choose one listed in Google AI Studio for your API key.
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});


export async function generateResponse(message) {
  try {
    const response = await geminiModel.invoke([new HumanMessage(message)]);

    return response.text;
  } catch (error) {
    console.error("Gemini request failed:", error.message);
    throw error;
  }
}
