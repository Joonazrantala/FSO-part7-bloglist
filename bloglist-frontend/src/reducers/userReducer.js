import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userlist: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setUserList(state, action) {
      state.userlist = action.payload;
    },
    clearUser(state, action) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, setUserList } = userSlice.actions;
export default userSlice.reducer;
