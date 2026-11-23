import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import axios from "axios";
import { generateApi } from "swagger-typescript-api";

const schemaPath = new URL("../src/api/swagger.json", import.meta.url);
const output = fileURLToPath(new URL("../src/api/generated/", import.meta.url));
const schemaUrl = process.env.API_SCHEMA_URL;
const schema = schemaUrl
  ? (await axios.get(schemaUrl, { timeout: 10000 })).data
  : JSON.parse(await readFile(schemaPath, "utf8"));

const operationIds = {
  "/fuel_consumptions": { get: "listFuelConsumptions", post: "createFuelConsumption" },
  "/fuel_consumptions/feed": { get: "getFuelConsumptionFeed" },
  "/fuel_consumptions/draft": { get: "getFuelConsumptionDraft" },
  "/fuel_consumptions/{id}": { delete: "deleteFuelConsumption" },
  "/fuel_consumptions/{id}/publication": { put: "publishFuelConsumption" },
  "/fuel_consumptions/{id}/likes": { post: "setFuelConsumptionLike" },
};
const paths = Object.fromEntries(
  Object.entries(operationIds).map(([path, methods]) => [
    path,
    Object.fromEntries(Object.entries(methods).map(([method, operationId]) => {
      const operation = schema.paths[path]?.[method];
      if (!operation) throw new Error(`Swagger: отсутствует ${method.toUpperCase()} ${path}`);
      return [method, { ...operation, operationId }];
    })),
  ]),
);
const definitions = Object.fromEntries(
  ["api.CarDTO", "api.LikeRequest", "api.PublicationRequest"].map((name) => [name, schema.definitions[name]]),
);

await mkdir(output, { recursive: true });
await generateApi({
  spec: { ...schema, paths, definitions },
  fileName: "FuelConsumptionsApi.ts",
  output,
  httpClientType: "axios",
  apiClassName: "FuelConsumptionsApi",
});
if (schemaUrl) await writeFile(schemaPath, JSON.stringify(schema, null, 2) + "\n");
