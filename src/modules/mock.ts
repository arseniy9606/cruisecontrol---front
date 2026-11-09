import type { FuelConsumption } from "./fuel_consumptions";
// Только локальные данные: запросов к API, БД и S3 в ЛР5 нет.
export const FUEL_CONSUMPTIONS_MOCK: FuelConsumption[] = [
  {
    id: 1,
    name: "Седан",
    description:
      "Легковой автомобиль для города и загородных поездок. Круиз-контроль поддерживает заданную скорость на трассе.",
    consumption_rate: 7.2,
    fuel_tank_volume: 50,
    image_url: "/fuel_consumptions/cars_sedan.jpg",
    video_url: "/fuel_consumptions/cars_sedan.mp4",
    likes_count: 12,
  },
  {
    id: 2,
    name: "Внедорожник",
    description:
      "Просторный автомобиль повышенной проходимости. Большой топливный бак подходит для дальних путешествий.",
    consumption_rate: 10.7,
    fuel_tank_volume: 80,
    image_url: "/fuel_consumptions/cars_suv.jpg",
    video_url: "/fuel_consumptions/cars_suv.mp4",
    likes_count: 8,
  },
  {
    id: 3,
    name: "Микроавтобус",
    description:
      "Пассажирский транспорт для групповых поездок. Расход зависит от загрузки и дорожных условий.",
    consumption_rate: 12.5,
    fuel_tank_volume: 75,
    image_url: "/fuel_consumptions/cars_minibus.jpg",
    video_url: "/fuel_consumptions/cars_minibus.mp4",
    likes_count: 15,
  },
  {
    id: 4,
    name: "Фура",
    description:
      "Магистральный тягач для грузовых перевозок. На длинных маршрутах равномерное движение помогает экономить топливо.",
    consumption_rate: 29.5,
    fuel_tank_volume: 600,
    image_url: "/fuel_consumptions/cars_truck.jpg",
    video_url: "/fuel_consumptions/cars_truck.mp4",
    likes_count: 21,
  },
  {
    id: 5,
    name: "Автомобиль без медиа",
    description:
      "Учебная карточка: изображение и видео не заполнены. Приложение подставляет локальные файлы по умолчанию.",
    consumption_rate: 8.5,
    fuel_tank_volume: 55,
    image_url: "",
    video_url: "",
    likes_count: 0,
  },
];
