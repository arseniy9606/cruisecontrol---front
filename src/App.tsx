import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { FuelConsumptionRange } from "./modules/fuel_consumptions";
import { FUEL_CONSUMPTIONS_MOCK } from "./modules/mock";
import { FUEL_TILES } from "./Routes";
import TabBar from "./components/TabBar";
import FuelTilesPage from "./pages/FuelTilesPage";
import FuelFeedPage from "./pages/FuelFeedPage";
export default function App() {
  const [range, setRange] = useState<FuelConsumptionRange>({
    minimum: "",
    maximum: "",
  });
  const automobiles = FUEL_CONSUMPTIONS_MOCK.filter(
    (item) =>
      (range.minimum === "" ||
        item.consumption_rate >= Number(range.minimum)) &&
      (range.maximum === "" || item.consumption_rate <= Number(range.maximum)),
  );
  return (
    <div className="mobile-app">
      <Routes>
        <Route
          path={FUEL_TILES}
          element={
            <FuelTilesPage
              automobiles={automobiles}
              range={range}
              onApply={setRange}
            />
          }
        />
        <Route
          path={`${FUEL_TILES}/feed/:id`}
          element={<FuelFeedPage automobiles={automobiles} />}
        />
        <Route path="*" element={<Navigate to={FUEL_TILES} replace />} />
      </Routes>
      <TabBar firstId={automobiles[0]?.id ?? 0} />
    </div>
  );
}
