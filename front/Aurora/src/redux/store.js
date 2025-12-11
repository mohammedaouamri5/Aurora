import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import userDataReducer from "./userDataSlice.js";
import signsReducer from "./signsSlice.js";
import ConversationsNameReducer from "./ConversationaNameSlice.js";
import MessagesReducer from "./MessegesSlice";
import { websocketMessages, websocketTitel } from "./websocketMiddleware.js";
import { websocketMessageReducer, websocketTitleReducer } from "./websocketReducer.js";

const store = configureStore({
  reducer: {
    Messages: MessagesReducer,
    auth: authReducer,
    userData: userDataReducer,
    signs: signsReducer,
    ConversationsName: ConversationsNameReducer,
    websocketMessages: websocketMessageReducer,
    websocketTitles: websocketTitleReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMessages).concat(websocketTitel),
});

export default store;

