import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    state: false,
}
const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeState: (state, action: PayloadAction<boolean>) => {
            state.state = action.payload
        }
    }
})

export const {setThemeState} =  themeSlice.actions;
export default themeSlice.reducer;