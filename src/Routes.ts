export const FUEL_TILES = "/fuel_consumptions";
export const FUEL_FEED = `${FUEL_TILES}/feed`;
export const FUEL_DRAFT = `${FUEL_TILES}/add`;
export const FUEL_LOGIN = "/login";
export const fuelFeedPath = (id: number) => `${FUEL_FEED}/${id}`;
