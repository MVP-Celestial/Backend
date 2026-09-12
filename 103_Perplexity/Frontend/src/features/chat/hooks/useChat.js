import {initializeSocketConnection} from "../service/chat.socket"
import {sendMessage, getChats, getMessages, deleteChat} from "../service/chat.api"
import { useDispatch } from "react-redux"
import {setChats, setCurrentChat, setError, setLoading} from "../chat.slice"



export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage(message, chatId) {
        dispatch(setLoading(true))
       const data = await sendMessage({ message, chatId })
       const {chat, aiMsg} = data
       dispatch(setChats((prev) => {

        return {
            ...prev,
            [chat.title]: {
                ...chat,
                messages: [...chat.messages, aiMsg]
                
            }
        }

       }))
    }

    return {
        initializeSocketConnection,
        handleSendMessage
    }
}