import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import wallReducer from "./wallSlice";
import nameReducer from "./nameSlice";
import emailReducer from "./emailSlice";
import themeReducer from './themeSlice';
import startPageStateReducer from './startPageSlice';
const store = configureStore({
  reducer: {
    wall: wallReducer,
    name: nameReducer,
    email: emailReducer,
    theme: themeReducer,
    startPageState: startPageStateReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
