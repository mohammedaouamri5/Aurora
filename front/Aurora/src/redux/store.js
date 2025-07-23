import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import userDataReducer from "./userDataSlice.js";
import signsReducer from "./signsSlice.js";
import ConversationsNameReducer from "./ConversationaNameSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userData: userDataReducer,
    signs: signsReducer,
    ConversationsName:ConversationsNameReducer,
  },
});

export default store;

