import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Replace with your backend API URL
  withCredentials: true, // Include cookies in requests
});

export const sendMessage = async ({ message , chatId }) => {
   const response = await api.post("/api/chats/message", { message, chatId });
   return response.data;
}

export const getMessages = async (chatId) => {
  const response = await api.get(`/api/chats/${chatId}/messages`);
  return response.data;
}

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/api/chats/${chatId}`);
  return response.data;
}