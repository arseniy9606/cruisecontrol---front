import axios from "axios";
import { FuelConsumptionsApi } from "./generated/FuelConsumptionsApi";
import type { ApiCarDTO } from "./generated/FuelConsumptionsApi";
import type { FuelConsumption } from "../modules/fuel_consumptions";

const apiConfig = { baseURL: "/api", timeout: 15000 };
const fuelConsumptionsApi = new FuelConsumptionsApi(apiConfig);
export const fuelConsumptionApi = fuelConsumptionsApi.fuelConsumptions;
export const fuelUserHttp = axios.create(apiConfig);

const jwtStorageKey = "fuel_consumptions_jwt";
// После F5 интерфейс и запросы гостевые. Копия JWT доступна в localStorage.
let activeFuelJwt = "";
fuelConsumptionsApi.instance.interceptors.request.use((config) => {
  if (activeFuelJwt) config.headers.set("Authorization", `Bearer ${activeFuelJwt}`);
  return config;
});

export function saveFuelJwt(token: string) {
  localStorage.setItem(jwtStorageKey, token);
  activeFuelJwt = token;
}

export function clearFuelJwt() {
  localStorage.removeItem(jwtStorageKey);
  activeFuelJwt = "";
}

export function fuelAuthHeaders() {
  return { Authorization: `Bearer ${activeFuelJwt}` };
}

export function isFuelBackendUnavailable(error: unknown) {
  return axios.isAxiosError(error) && !axios.isCancel(error) &&
    (!error.response || [502, 503, 504].includes(error.response.status));
}

export function fuelRequestError(error: unknown, message: string) {
  if (isFuelBackendUnavailable(error)) return "Нет связи с сервером автомобилей.";
  if (axios.isAxiosError(error) && error.response?.status === 403) {
    return "Сеанс завершён. Выйдите и войдите снова.";
  }
  return message;
}

function fuelMediaUrl(value: string | undefined) {
  if (!value) return "";
  const url = new URL(value, window.location.origin);
  return `/s3${url.pathname}${url.search}`;
}

export function readFuelConsumption(car: ApiCarDTO): FuelConsumption {
  if (!car?.id || typeof car.name !== "string") {
    throw new Error("Некорректная карточка автомобиля");
  }
  return {
    id: car.id,
    name: car.name,
    description: car.description ?? "",
    consumption_rate: car.consumption_rate ?? 0,
    fuel_tank_volume: car.fuel_tank_volume ?? 0,
    image_url: fuelMediaUrl(car.image_url),
    video_url: fuelMediaUrl(car.video_url),
    likes_count: car.likes_count ?? 0,
    is_owner: car.is_owner === 1,
    liked: car.liked === 1,
  };
}
