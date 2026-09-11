import {Router} from 'express';
import { sendMessage, getChats, getMessages } from '../controller/chat.controller.js';
import {authUser} from '../middleware/auth.middleware.js';

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessage);  //talk to ai
chatRouter.get("/", authUser, getChats); //retrieve all chats for a user that they have previously had with the ai
chatRouter.get("/chats/:chatId/messages", authUser, getMessages); //retrieve all messages for a specific chat that the user has previously had with the ai
chatRouter.delete("/delete/:chatId", authUser, deleteChat); //delete a specific chat and all messages associated with it


export default chatRouter;

