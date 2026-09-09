import { generateResponse, generateChatTitle } from "../services/ai.service.js";

export async function sendMessage(req, res) {

    const { message } = req.body;

    const title = await generateChatTitle(message);
    console.log("Generated Title:", title);
    const result = await generateResponse(message);
    res.json({ AiMessage: result, title: title });
}