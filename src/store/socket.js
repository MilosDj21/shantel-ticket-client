import { createSlice } from "@reduxjs/toolkit";

const initialSocketState = {
  isConnected: false,
  notificationList: [],
  unreadNotifications: 0,
};

const socketSlice = createSlice({
  name: "socketChat",
  initialState: initialSocketState,
  reducers: {
    connect(state) {
      state.isConnected = true;
    },
    addNotification(state, action) {
      let newList = [action.payload, ...state.notificationList];
      if (state.notificationList.length > 10) {
        newList.pop();
      }
      state.notificationList = [...newList];
      state.unreadNotifications = state.unreadNotifications + 1;
    },
    readAllNotifications(state) {
      state.unreadNotifications = 0;
    },
  },
});

export const socketActions = socketSlice.actions;
export default socketSlice.reducer;
