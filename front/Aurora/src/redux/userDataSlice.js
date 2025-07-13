import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACK_END_URL;

// Async action for fetch Types
export const fetchTypes = createAsyncThunk(
  "userData/fetchTypes",
  async (_, { rejectWithValue }) => {
  console.log("NIGGA")
    try {
      const res = await axios.get(`${url}/api/All/Types`);
  console.log(`${url}/api/All/Types`)
      console.log(res);
      const { types } = res.data;
      return { types };
    } catch (err) {
      const errorMessage =
        err.response && err.response.status === 401
          ? "Something went wrong"
          : "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async action for fetch blood Types
export const fetchBloodTypes = createAsyncThunk(
  "userData/fetchBloodTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/api/All/BloodType`);
      console.log("blood: ", res);
      const  bloodTypes  = res.data.bloodtypes;

      return  bloodTypes ;
    } catch (err) {
      const errorMessage =
        err.response && err.response.status === 401
          ? "Something went wrong"
          : "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async action for fetch Etats Civil
export const fetchEtatCivil = createAsyncThunk(
  "userData/fetchEtatCivil",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/api/All/EttaCivile`);
      console.log("etat: ", res);
      const etatsCivil = res.data.etetciviles;
      return etatsCivil;
    } catch (err) {
      const errorMessage =
        err.response && err.response.status === 401
          ? "Something went wrong"
          : "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Auth Slice
const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    userDataStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    types: [],
    bloodTypes: [],
    etatsCivil: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "success";
        state.types = action.payload.types;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchBloodTypes.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchBloodTypes.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "success";
        state.bloodTypes = action.payload;
      })
      .addCase(fetchBloodTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchEtatCivil.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchEtatCivil.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "success";
        state.etatsCivil = action.payload;
      })
      .addCase(fetchEtatCivil.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userDataSlice.reducer;
