import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import fuelConsumptions from "./fuelConsumptionsSlice";
import fuelUser from "./fuelUserSlice";
import fuelInterface from "./fuelInterfaceSlice";

// configureStore подключает redux-thunk через getDefaultMiddleware.
export const store = configureStore({
  reducer: { fuelConsumptions, fuelUser, fuelInterface },
});

export type FuelRootState = ReturnType<typeof store.getState>;
export type FuelDispatch = typeof store.dispatch;
export const useFuelDispatch = useDispatch.withTypes<FuelDispatch>();
export const useFuelSelector = useSelector.withTypes<FuelRootState>();
