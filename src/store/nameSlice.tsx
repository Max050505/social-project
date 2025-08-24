import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NameState {
  firstName: string;
  lastName: string;
}

const nameSlice = createSlice({
  name: "name",
  initialState: { firstName: "", lastName: "" } as NameState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setName: (state, action: PayloadAction<{ firstName: string; lastName: string }>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
    clearName: (state) => {
      state.firstName = "";
      state.lastName = "";
    },
  },
});

export const { setName, setFirstName, setLastName, clearName } = nameSlice.actions;
export default nameSlice.reducer;
