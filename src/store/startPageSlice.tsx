import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StartPageState {
    isActive: boolean;
}

const initialState: StartPageState = {
    isActive: false,
};

const startPageSlice = createSlice({
    name: 'startPageState',
    initialState,
    reducers: {
        setStartPageState: (state, action: PayloadAction<boolean>) => {
            state.isActive = action.payload;
        },
    },
});

export const { setStartPageState } = startPageSlice.actions;
export default startPageSlice.reducer;