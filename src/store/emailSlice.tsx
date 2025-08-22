
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const emailSlice = createSlice({
    name: "email",
    initialState: "" as string,
    reducers: {
      setEmail: (_state, action: PayloadAction<string>) => action.payload,
      clearEmail: () => "",
    },
  });
  
  export const { setEmail, clearEmail } = emailSlice.actions;
  export default emailSlice.reducer;