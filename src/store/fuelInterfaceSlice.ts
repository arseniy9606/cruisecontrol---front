import { createSlice, isAnyOf, isPending, isRejected, type PayloadAction } from "@reduxjs/toolkit";
import * as fuelThunks from "./fuelConsumptionThunks";

const thunks = [
  fuelThunks.loadFuelConsumptions,
  fuelThunks.loadFuelConsumptionFeed,
  fuelThunks.loadFuelConsumptionDraft,
  fuelThunks.createFuelConsumptionDraft,
  fuelThunks.publishFuelConsumption,
  fuelThunks.deleteFuelConsumption,
  fuelThunks.setFuelConsumptionLike,
] as const;
const fuelInterfaceSlice = createSlice({
  name: "fuelInterface",
  initialState: { pending: 0, error: "" },
  reducers: {
    fuelAuthStarted(state) {
      state.pending += 1;
      state.error = "";
    },
    fuelAuthFinished(state) {
      state.pending -= 1;
    },
    setFuelRequestError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(...thunks), (state) => {
        state.pending += 1;
        state.error = "";
      })
      .addMatcher(isAnyOf(...thunks.map((thunk) => thunk.settled)), (state) => {
        state.pending -= 1;
      })
      .addMatcher(isRejected(...thunks), (state, action) => {
        if (!action.meta.aborted) state.error = action.payload ?? "Ошибка запроса автомобилей.";
      });
  },
});

export const { fuelAuthStarted, fuelAuthFinished, setFuelRequestError } = fuelInterfaceSlice.actions;
export default fuelInterfaceSlice.reducer;
