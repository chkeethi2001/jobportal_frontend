import { createSlice } from "@reduxjs/toolkit";

// ✅ Safely parse user from localStorage
let storedUser = null;
try {
  const rawUser = localStorage.getItem("user");
  storedUser = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
} catch (err) {
  console.error("Error parsing stored user:", err);
  storedUser = null;
}

// Initial State
const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  user: storedUser,
  loading: false,
  error: null,
  isLoggedin: !!localStorage.getItem("token"),
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.isLoggedin = false;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
    addUser: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.isLoggedin = true;
      state.error = null;

      // ✅ Persist to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
  },
});

export const { logout, addUser } = authSlice.actions;
export default authSlice.reducer;
