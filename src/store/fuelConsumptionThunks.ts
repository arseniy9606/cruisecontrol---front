import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  fuelConsumptionApi,
  fuelRequestError,
  isFuelBackendUnavailable,
  readFuelConsumption,
} from "../api";
import type { ApiPublicationRequest } from "../api/generated/FuelConsumptionsApi";
import { FUEL_CONSUMPTIONS_MOCK } from "../modules/mock";
import type { FuelRootState } from "./index";

const fuelThunk = createAsyncThunk.withTypes<{ state: FuelRootState; rejectValue: string }>();
const statusIs = (error: unknown, status: number) =>
  axios.isAxiosError(error) && error.response?.status === status;

export const loadFuelConsumptions = fuelThunk(
  "fuelConsumptions/loadList",
  async (_, { getState, signal, rejectWithValue }) => {
    const { fuelUser, fuelConsumptions } = getState();
    const { minimum, maximum } = fuelConsumptions.appliedRange;
    const consumption_min = minimum === "" ? undefined : Number(minimum);
    const consumption_max = maximum === "" ? undefined : Number(maximum);
    try {
      const { data } = await fuelConsumptionApi.listFuelConsumptions(
        { consumption_min, consumption_max }, { signal },
      );
      return data.map(readFuelConsumption);
    } catch (error) {
      if (!fuelUser.login && isFuelBackendUnavailable(error)) {
        return FUEL_CONSUMPTIONS_MOCK.filter(({ consumption_rate }) =>
          (consumption_min === undefined || consumption_rate >= consumption_min) &&
          (consumption_max === undefined || consumption_rate <= consumption_max),
        );
      }
      return rejectWithValue(fuelRequestError(error, "Не удалось загрузить автомобили."));
    }
  },
);

type FuelFeedQuery = { id?: number; next?: boolean };

export const loadFuelConsumptionFeed = fuelThunk(
  "fuelConsumptions/loadFeed",
  async (query: FuelFeedQuery, { getState, signal, rejectWithValue }) => {
    try {
      let response;
      try {
        response = await fuelConsumptionApi.getFuelConsumptionFeed(query, { signal });
      } catch (error) {
        // Бэкенд отвечает 404 после последнего автомобиля. Продолжаем с первого.
        if (!query.next || !statusIs(error, 404)) throw error;
        response = await fuelConsumptionApi.getFuelConsumptionFeed({}, { signal });
      }
      return readFuelConsumption(response.data);
    } catch (error) {
      if (!getState().fuelUser.login && isFuelBackendUnavailable(error)) {
        const requestedId = query.id;
        if (query.next && requestedId !== undefined) {
          return FUEL_CONSUMPTIONS_MOCK.find(({ id }) => id > requestedId) ?? FUEL_CONSUMPTIONS_MOCK[0];
        }
        return query.id === undefined
          ? FUEL_CONSUMPTIONS_MOCK[0]
          : FUEL_CONSUMPTIONS_MOCK.find(({ id }) => id === query.id) ?? null;
      }
      if (statusIs(error, 404)) return null;
      return rejectWithValue(fuelRequestError(error, "Не удалось загрузить ленту."));
    }
  },
);

export const loadFuelConsumptionDraft = fuelThunk(
  "fuelConsumptions/loadDraft",
  async (_, { signal, rejectWithValue }) => {
    try {
      const { data } = await fuelConsumptionApi.getFuelConsumptionDraft({ signal });
      return readFuelConsumption(data);
    } catch (error) {
      if (statusIs(error, 404)) return null;
      return rejectWithValue(fuelRequestError(error, "Не удалось загрузить черновик."));
    }
  },
);

type FuelDraftFields = Parameters<typeof fuelConsumptionApi.createFuelConsumption>[0];

export const createFuelConsumptionDraft = fuelThunk(
  "fuelConsumptions/createDraft",
  async (fields: FuelDraftFields, { rejectWithValue }) => {
    try {
      const { data } = await fuelConsumptionApi.createFuelConsumption(fields);
      return readFuelConsumption(data);
    } catch (error) {
      return rejectWithValue(fuelRequestError(error, statusIs(error, 404)
        ? "Проверьте название, формат и размер файлов. Запрос должен быть меньше 32 МБ."
        : "Не удалось создать черновик автомобиля."));
    }
  },
);

export const publishFuelConsumption = fuelThunk(
  "fuelConsumptions/publish",
  async ({ id, ...fields }: Required<ApiPublicationRequest> & { id: number }, { rejectWithValue }) => {
    try {
      await fuelConsumptionApi.publishFuelConsumption(id, fields);
    } catch (error) {
      return rejectWithValue(fuelRequestError(error, "Не удалось опубликовать черновик автомобиля."));
    }
  },
);

export const deleteFuelConsumption = fuelThunk(
  "fuelConsumptions/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await fuelConsumptionApi.deleteFuelConsumption(id);
      return id;
    } catch (error) {
      return rejectWithValue(fuelRequestError(error, "Не удалось удалить автомобиль."));
    }
  },
);

export const setFuelConsumptionLike = fuelThunk(
  "fuelConsumptions/setLike",
  async ({ id, liked }: { id: number; liked: boolean }, { rejectWithValue }) => {
    try {
      const { data } = await fuelConsumptionApi.setFuelConsumptionLike(id, { liked: liked ? 1 : 0 });
      return readFuelConsumption(data);
    } catch (error) {
      return rejectWithValue(fuelRequestError(error, "Не удалось изменить отметку «Нравится»."));
    }
  },
);
