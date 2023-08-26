import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  roles: null,
  profileImage: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      state.userId = action.payload._id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.roles = action.payload.roles;
      state.profileImage = action.payload.profileImage;
    },
    logout(state) {
      state.userId = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.roles = null;
      state.profileImage = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
