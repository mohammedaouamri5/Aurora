import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import userDataReducer from "./userDataSlice.js";
import signsReducer from "./signsSlice.js";
import ConversationsNameReducer from "./ConversationaNameSlice.js";
import MessagesReducer from "./MessegesSlice";
import { websocketMessages } from "./websocketMiddleware.js";
import { websocketMessageReducer } from "./websocketReducer.js";

const store = configureStore({
  reducer: {
    Messages: MessagesReducer,
    auth: authReducer,
    userData: userDataReducer,
    signs: signsReducer,
    ConversationsName: ConversationsNameReducer,
    websocketMessages: websocketMessageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMessages),
});

export default store;

