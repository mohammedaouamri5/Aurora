import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACK_END_URL;

export const GetConversations = createAsyncThunk(
  "conversations/fetchconversation",
  async (_, { rejectWithValue }) => {
    try {


      const token = localStorage.getItem("token"); // get your JWT

      const res = await axios.get(`${url}/conversations`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log("res.data : " , res.data)
      var  result  = res.data.conversations
      console.log("result : " , result)
      return result;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Something went wrong");
    }
  }
);

export const AddConversation = createAsyncThunk(
  "conversations/addConversation",
  async (newConversation, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // get your JWT
      const res = await axios.post(`${url}/create-conversation`, newConversation, {
        headers: {
          Authorization: `${token}`, // attach JWT
        },
      });

      if (res.status === 200 || res.status === 201) {
        console.log(res.data)
        return res.data;
      }
      return rejectWithValue("Unexpected response status");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        return rejectWithValue("Unauthorized – Invalid or expired token");
      }
      return rejectWithValue("Failed to add conversation");
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
      })
      .addCase(AddConversation.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(AddConversation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ConversationsNameSlice.reducer;

