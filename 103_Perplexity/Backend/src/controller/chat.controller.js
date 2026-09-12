import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/chat.model.js";

export async function sendMessage(req, res) {

    const { message, chat:chatId } = req.body;



    
    console.log("Generated Title:", title);
    
    const result = await generateResponse(message);

    let title = null, chat = null;

    if(!chatId) {

        const title = await generateChatTitle(message);
        const chat = await chatModel.create({
            user: req.user._id,
            title
        });

    }

    const messages = await messageModel.find({ chat: chat._id || chatId }).sort({ createdAt: 1 });
    

    const userMessage = await messageModel.create({
        chat: chat._id,
        content: message,
        role: "user"
    })

    const aiMsg = await messageModel.create({
        chat: chat._id,
        content: result,
        role: "ai"
    });




    res.json(
        { 
            AiMessage: result,
            title,
            chat,
            aiMsg
            
            }
    );
}

export async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user._id }).sort({ createdAt: -1 }); 



    res.status(200).json({ 
        message: "Chats retrieved successfully",
        chats
    });


}


export async function getMessages(req, res) {
    const {chatId} = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user._id
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
        user: req.user._id
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

