import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import, it's a default export

const url = import.meta.env.VITE_BACK_END_URL;

// Define permissions for each role
const PERMISSIONS = {
  Doctor: [
    "see Patients list",
    "see Patient details",
    "see recent Patient Records",
    "see All Patient Records",
    "see recent Patient Records details",
    "see all patient records details",
    "download Patient records",
    "see All Appointment list",
    "see today Appointment list",
    "add new Appointment",
    "modify Appointments",
    "cancel Appointments",
    "start Appointments",
    "end Appointments",
    "see Rapports",
    "see Office",
  ],
  nurse: [
    "see Patients list",
    "see Patient details",
    "see recent Patient Records",
    "see recent Patient Records details",
    "see today Appointment list",
    "see Rapports",
  ],
  admin: [
    "see Patients list",
    "add Patient",
    "modify Patient details",
    "remove Patient",
    "see Patient details",
    "see All Patient Records",
    "download Patient records",
    "see All Appointment list",
    "add new Appointment",
    "modify Appointments",
    "delete Appointments",
    "cancel Appointments",
    "start Appointments",
    "end Appointments",
    "see Rapports",
    "see Services",
    "add Service",
    "delete Service",
    "modify Service",
    "see Calender",
  ],
};

// Utility function to check if the token is expired
export function isTokenExpired(token) {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // in seconds

  return decodedToken.exp < currentTime; // true if expired
}

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/auth/login`, { email, password });
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      let user = decodedToken.User;

      // Assign permissions based on role
      user.permissions = PERMISSIONS[user.TypeName] || [];

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (err) {
      return rejectWithValue(
        err.response && err.response.status === 401
          ? "Invalid email or password, please try again"
          : "Something went wrong"
      );
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ Email, Password, Name, TypeID }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/auth/register`, {
        Email,
        Password,
        Name,
        TypeID,
      });
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      let user = decodedToken.User;

      // Assign permissions based on role
      user.permissions = PERMISSIONS[user.TypeName] || [];

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response.data.error || "Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    error: null,
    authStatus: "idle",
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    autoLogout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      state.error = "Session expired, please log in again";

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        window.location.href = "/";
      })
      .addCase(login.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, autoLogout } = authSlice.actions;
export default authSlice.reducer;
