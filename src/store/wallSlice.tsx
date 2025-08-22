import { createSlice } from '@reduxjs/toolkit';
import {walls} from '../UI/backgroundWall';

const initialState = {
  walls,
  currentWallIndex: 0
}

const wallChangeSlice = createSlice({
  name: 'wall',
  initialState,
  reducers: {
    setRandomWall: (state) => { state.currentWallIndex = Math.floor(Math.random() * state.walls.length) },
    setNextWall: (state) => { state.currentWallIndex = (state.currentWallIndex + 1 ) % state.walls.length},
    setPrevWall: (state) => {state.currentWallIndex = (state.currentWallIndex - 1 + state.walls.length) % state.walls.length }
  }
});

export const { setRandomWall, setNextWall, setPrevWall } = wallChangeSlice.actions;
export default wallChangeSlice.reducer;