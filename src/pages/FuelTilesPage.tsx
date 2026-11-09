import type {
  FuelConsumption,
  FuelConsumptionRange,
} from "../modules/fuel_consumptions";
import ConsumptionFilter from "../components/ConsumptionFilter";
import FuelConsumptionCard from "../components/FuelConsumptionCard";
interface Props {
  automobiles: FuelConsumption[];
  range: FuelConsumptionRange;
  onApply: (range: FuelConsumptionRange) => void;
}
export default function FuelTilesPage({ automobiles, range, onApply }: Props) {
  return (
    <main className="tiles-page">
      <header>
        <p className="eyebrow">КАТАЛОГ АВТОМОБИЛЕЙ</p>
        <h1>Расход топлива</h1>
        <p className="intro">Выберите автомобиль для поездки</p>
      </header>
      <ConsumptionFilter value={range} onApply={onApply} />
      <p className="result-count" role="status">
        Найдено автомобилей: {automobiles.length}
      </p>
      {automobiles.length ? (
        <div className="tiles">
          {automobiles.map((automobile) => (
            <FuelConsumptionCard key={automobile.id} automobile={automobile} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Автомобили не найдены</h2>
          <p>Измените диапазон расхода или сбросьте фильтр.</p>
        </div>
      )}
    </main>
  );
}
