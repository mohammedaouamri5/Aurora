
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACK_END_URL;

export const GetConversations = createAsyncThunk(
  "conversations/fetchcods",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // get your JWT

      const res = await axios.get(`${url}/RAG/my-docs`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      var result = res.data.files
      return result;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Something went wrong");
    }
  }
);



const MyDocsSlice = createSlice({
  name: "MyDocs",
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
  },
});

export default MyDocsSlice.reducer;

