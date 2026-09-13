import { initializeSocketConnection } from "../service/chat.socket"
import { sendMessage } from "../service/chat.api"
import { useDispatch } from "react-redux"
import { setCurrentChatId, setError, setLoading } from "../chat.slice"



export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage(message, chatId) {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await sendMessage({ message, chatId })
            dispatch(setCurrentChatId(data.chat._id))
            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Unable to send message'))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage
    }
}
