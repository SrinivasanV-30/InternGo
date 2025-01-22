// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  roles: [],
  permissions: [],
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { token, roles, permissions, user } = action.payload;
      state.token = token;
      state.roles = roles;
      state.permissions = permissions;
      state.user = user;
    },
    clearAuth: (state) => {
      state.token = null;
      state.roles = [];
      state.permissions = [];
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
