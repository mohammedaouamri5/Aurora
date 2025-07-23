import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACK_END_URL;

// Async thunk to fetch conversations
export const GetConversations = createAsyncThunk(
  "conversations/fetchconversation",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/conversations`);
      var Data = res.data
      return Data; // Assuming it's the raw array

    } catch (err) {
      console.log(err)
      return rejectWithValue("Something went wrong");
    }
  }
);

const ConversationsNameSlice = createSlice({
  name: "ConversationsName",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetConversations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(GetConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(GetConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default ConversationsNameSlice.reducer;

