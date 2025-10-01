import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
}

export interface AuthState {
  auth: { user: User } | null;
}

const initialState: AuthState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.auth = { user: action.payload };
    },
    logout: (state) => {
      state.auth = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
