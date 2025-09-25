import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  token: string | null;
  id: string | null;
}

const initialState: UserState = {
  username: null,
  token: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string; token: string; id: string }>) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    cleanUser: (state) => {
      state.username = null;
      state.token = null;
      state.id = null;
    },
  },
});

export const { setUser, cleanUser } = userSlice.actions;
export default userSlice.reducer;
