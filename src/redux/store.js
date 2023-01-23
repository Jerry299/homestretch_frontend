import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/users";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
