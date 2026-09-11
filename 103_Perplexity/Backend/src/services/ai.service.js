import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

const geminiModel = new ChatGoogleGenerativeAI({
  // Use a currently supported model. If this model is not enabled for your
  // Google AI project, choose one listed in Google AI Studio for your API key.
  model: "gemini-3.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


export async function generateResponse(message) {
  try {
    const response = await geminiModel.invoke(messages.map (msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      } else {
        throw new Error(`Unknown message role: ${msg.role}`);
      }
    }));

    return response.text;
  } catch (error) {
    console.error("Gemini request failed:", error.message);
  }
}


export async function generateChatTitle(message) {
  const response = await geminiModel.invoke([
     new SystemMessage(`You are a helpful assistant that generates concise and relevant titles for chat conversations.
      user will provide you with a chat message, and you will respond with a suitable title for that message. in 2-4 words.
      `),
      new HumanMessage(`Generate a title for the following chat message: "${message}"`),
  ]);

  return response.text;
}
