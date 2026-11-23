import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FuelConsumption, FuelConsumptionRange } from "../modules/fuel_consumptions";
import {
  createFuelConsumptionDraft,
  deleteFuelConsumption,
  loadFuelConsumptionDraft,
  loadFuelConsumptionFeed,
  loadFuelConsumptions,
  publishFuelConsumption,
  setFuelConsumptionLike,
} from "./fuelConsumptionThunks";
import { fuelUserLoggedIn, fuelUserLoggedOut } from "./fuelUserSlice";

export const emptyFuelRange: FuelConsumptionRange = { minimum: "", maximum: "" };
interface FuelConsumptionsState {
  filterRange: FuelConsumptionRange;
  appliedRange: FuelConsumptionRange;
  automobiles: FuelConsumption[] | null;
  feedAutomobile: FuelConsumption | null;
  draftAutomobile: FuelConsumption | null;
  draftLoaded: boolean;
}
const initialState: FuelConsumptionsState = {
  filterRange: emptyFuelRange,
  appliedRange: emptyFuelRange,
  automobiles: null,
  feedAutomobile: null,
  draftAutomobile: null,
  draftLoaded: false,
};

const fuelConsumptionsSlice = createSlice({
  name: "fuelConsumptions",
  initialState,
  reducers: {
    setFuelFilterRange(state, action: PayloadAction<FuelConsumptionRange>) {
      state.filterRange = action.payload;
    },
    applyFuelFilterRange(state, action: PayloadAction<FuelConsumptionRange>) {
      state.appliedRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fuelUserLoggedIn, ({ filterRange, appliedRange }) => ({
        ...initialState, filterRange, appliedRange,
      }))
      .addCase(fuelUserLoggedOut, () => initialState)
      .addCase(loadFuelConsumptions.pending, (state) => {
        state.automobiles = null;
      })
      .addCase(loadFuelConsumptions.fulfilled, (state, { payload }) => {
        state.automobiles = payload;
      })
      .addCase(loadFuelConsumptionFeed.pending, (state, { meta }) => {
        if (!meta.arg.next) state.feedAutomobile = null;
      })
      .addCase(loadFuelConsumptionFeed.fulfilled, (state, { payload }) => {
        state.feedAutomobile = payload;
      })
      .addCase(loadFuelConsumptionDraft.pending, (state) => {
        state.draftLoaded = false;
      })
      .addCase(loadFuelConsumptionDraft.fulfilled, (state, { payload }) => {
        state.draftAutomobile = payload;
        state.draftLoaded = true;
      })
      .addCase(createFuelConsumptionDraft.fulfilled, (state, { payload }) => {
        state.draftAutomobile = payload;
      })
      .addCase(publishFuelConsumption.fulfilled, (state) => {
        state.draftAutomobile = null;
      })
      .addCase(deleteFuelConsumption.fulfilled, (state, { payload }) => {
        state.automobiles = state.automobiles?.filter(({ id }) => id !== payload) ?? null;
        if (state.draftAutomobile?.id === payload) state.draftAutomobile = null;
        if (state.feedAutomobile?.id === payload) state.feedAutomobile = null;
      })
      .addCase(setFuelConsumptionLike.fulfilled, (state, { payload }) => {
        if (state.feedAutomobile?.id === payload.id) state.feedAutomobile = payload;
        const index = state.automobiles?.findIndex(({ id }) => id === payload.id) ?? -1;
        if (state.automobiles && index >= 0) state.automobiles[index] = payload;
      });
  },
});

export const { setFuelFilterRange, applyFuelFilterRange } = fuelConsumptionsSlice.actions;
export default fuelConsumptionsSlice.reducer;
