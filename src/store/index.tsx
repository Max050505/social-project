import { configureStore } from "@reduxjs/toolkit";
import wallReducer from "./wallSlice";
import nameReducer from "./nameSlice";
import emailReducer from "./emailSlice";
const store = configureStore({
  reducer: {
    wall: wallReducer,
    name: nameReducer,
    email: emailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
