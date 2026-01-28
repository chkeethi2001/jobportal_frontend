// src/redux/slices/resumeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileAPI } from "../../api/authAPI";
import { uploadResumeAPI, uploadProfilePicAPI } from "../../api/resumeAPI";

// Fetch Profile
export const fetchProfile = createAsyncThunk(
  "resume/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const data = await profileAPI(token); // expects { user: {...} }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Upload Resume
export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await uploadResumeAPI(formData); // expects { message, resumeUrl }
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//  Upload Profile Picture
export const uploadProfilePic = createAsyncThunk(
  "resume/uploadProfilePic",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await uploadProfilePicAPI(formData, token);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    user: null,
    resumeUrl: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.resumeUrl = action.payload.user?.resumeUrl || null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPLOAD RESUME
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeUrl = action.payload.resumeUrl || null;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPLOAD PROFILE PICTURE
      .addCase(uploadProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user.profilePicId = action.payload.profilePicId;
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resumeSlice.reducer;
