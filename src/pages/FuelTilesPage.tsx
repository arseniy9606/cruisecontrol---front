import { useEffect } from "react";
import type { FuelConsumptionRange } from "../modules/fuel_consumptions";
import ConsumptionFilter from "../components/ConsumptionFilter";
import FuelConsumptionCard from "../components/FuelConsumptionCard";
import { useFuelDispatch, useFuelSelector } from "../store";
import { applyFuelFilterRange } from "../store/fuelConsumptionsSlice";
import { loadFuelConsumptions } from "../store/fuelConsumptionThunks";

export default function FuelTilesPage() {
  const dispatch = useFuelDispatch();
  const { automobiles, appliedRange } = useFuelSelector((state) => state.fuelConsumptions);
  const login = useFuelSelector((state) => state.fuelUser.login);

  useEffect(() => {
    const request = dispatch(loadFuelConsumptions());
    return () => request.abort();
  }, [dispatch, login, appliedRange]);

  function applyFilter(range: FuelConsumptionRange) {
    dispatch(applyFuelFilterRange(range));
  }

  return (
    <main className="tiles-page">
      <header>
        <p className="eyebrow">ВЫБИРАЙТЕ СВОЙ РИТМ</p>
        <h1>
          Автомобили
          <br />
          для ваших поездок
        </h1>
      </header>
      <ConsumptionFilter onApply={applyFilter} />
      <div className="section-heading">
        <h2>Все автомобили</h2>
        {automobiles && (
          <span role="status" aria-label={`Найдено автомобилей: ${automobiles.length}`}>
            {automobiles.length}
          </span>
        )}
      </div>
      {automobiles && (automobiles.length ? (
        <div className="tiles">
          {automobiles.map((automobile) => (
            <FuelConsumptionCard key={automobile.id} automobile={automobile} canDelete={!!login && automobile.is_owner} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Автомобили не найдены</h2>
          <p>Измените диапазон расхода или сбросьте фильтр.</p>
        </div>
      ))}
    </main>
  );
}
