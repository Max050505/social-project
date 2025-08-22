import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const nameSlice = createSlice({
  name: "name",
  initialState: "",
  reducers: {
    setName: (_state, action: PayloadAction<string>) => action.payload,
    clearName: () => "",
  },
});


export const { setName, clearName } = nameSlice.actions;
export default nameSlice.reducer;
