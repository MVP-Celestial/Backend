import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,  
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setChats, setCurrentChatId, setLoading, setError } = chatSlice.actions;


export default chatSlice.reducer;






// chats = {

//     "docker and AWS": {
//         messages: [],
//         id: "docker and AWS",
//         lastUpdated: "2023-06-01T12:00:00Z",

//     }
// }


