import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import userDataReducer from "./userDataSlice.js";
import signsReducer from "./signsSlice.js";
import ConversationsNameReducer from "./ConversationaNameSlice.js";
import MessagesReducer from "./MessegesSlice";
import websocketMiddleware from "./websocketMiddleware.js";
import websocketReducer from "./websocketReducer.js";

const store = configureStore({
  reducer: {
    Messages: MessagesReducer,
    auth: authReducer,
    userData: userDataReducer,
    signs: signsReducer,
    ConversationsName: ConversationsNameReducer,
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});

export default store;

