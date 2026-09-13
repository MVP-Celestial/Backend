import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { searchInternet } from "./internet.service.js";
import * as z from "zod";

const geminiModel = new ChatGoogleGenerativeAI({
  // Use a currently supported model. If this model is not enabled for your
  // Google AI project, choose one listed in Google AI Studio for your API key.
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});


export async function generateResponse(message) {
  const messages = Array.isArray(message)
    ? message.map((msg) => {
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "ai" || msg.role === "assistant") return new AIMessage(msg.content);
        return new HumanMessage(msg.content);
      })
    : [new HumanMessage(message)];

  try {
    const response = await agent.invoke({ messages });
    const result = response.messages?.at(-1);
    return typeof result?.content === "string" ? result.content : result?.text || "";
  } catch (error) {
    console.error("Gemini agent request failed:", error.message);
    throw error;
  }
}

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Search the internet for current information.",
  schema: z.object({
    query: z.string().min(1),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
  systemPrompt:
    "You are a helpful assistant. For questions asking for current, live, latest, today's, or real-time information—including prices, markets, news, weather, and events—you must call searchInternet before answering. Use the search results to answer and mention when the information was retrieved. Do not claim that you lack internet access if the search tool is available.",
});
