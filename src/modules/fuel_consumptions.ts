export interface FuelConsumption {
  id: number;
  name: string;
  description: string;
  consumption_rate: number;
  fuel_tank_volume: number;
  image_url: string;
  video_url: string;
  likes_count: number;
}
export interface FuelConsumptionRange {
  minimum: string;
  maximum: string;
}
export const formatFuel = (value: number) =>
  value.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
