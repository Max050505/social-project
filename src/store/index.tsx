import { configureStore } from "@reduxjs/toolkit";
import wallReducer from "./wallSlice";
import nameReducer from "./nameSlice";
import emailReducer from "./emailSlice";
import themeReducer from './themeSlice';
const store = configureStore({
  reducer: {
    wall: wallReducer,
    name: nameReducer,
    email: emailReducer,
    theme: themeReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
