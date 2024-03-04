import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import socketReducer from "./socket";

const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
});

export default store;
