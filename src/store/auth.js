import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  roles: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      state = action.payload;
    },
    logout(state) {
      state = initialUserState;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
