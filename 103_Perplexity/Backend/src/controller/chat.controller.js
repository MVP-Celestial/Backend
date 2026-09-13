import { generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chatId } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        let chat;
        if (chatId) {
            chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }
        } else {
            const title = message.trim().split(/\s+/).slice(0, 6).join(" ");
            chat = await chatModel.create({
                user: req.user.id,
                title: title.slice(0, 160),
            });
        }

        const userMessage = await messageModel.create({
            chat: chat._id,
            content: message.trim(),
            sender: "user",
        });

        const result = await generateResponse(message.trim());
        const aiMsg = await messageModel.create({
            chat: chat._id,
            content: result,
            sender: "assistant",
        });

        chat.lastMessageAt = new Date();
        await chat.save();

        return res.json({
            chat,
            userMsg: userMessage,
            aiMsg,
        });
    } catch (error) {
        console.error("Send message failed:", error);
        return res.status(500).json({ message: "Unable to send message" });
    }
}

export async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user.id }).sort({ createdAt: -1 }); 



    res.status(200).json({ 
        message: "Chats retrieved successfully",
        chats
    });


}


export async function getMessages(req, res) {
    const {chatId} = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({

            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 });

    return res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}



export async function deleteChat(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    });

    await messageModel.deleteMany({ chat: chat._id }); //delete all messages associated with the chat

    if(!chat) {
        res.status(404).json({
            message: "Chat not found"
        })
    
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })


}

