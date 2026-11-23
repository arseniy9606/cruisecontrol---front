import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: { login: string | null } = { login: null };
const fuelUserSlice = createSlice({
  name: "fuelUser",
  initialState,
  reducers: {
    fuelUserLoggedIn(state, action: PayloadAction<string>) {
      state.login = action.payload;
    },
    fuelUserLoggedOut: () => initialState,
  },
});

export const { fuelUserLoggedIn, fuelUserLoggedOut } = fuelUserSlice.actions;
export default fuelUserSlice.reducer;
