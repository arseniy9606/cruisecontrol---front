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
        <p className="eyebrow">ВЫБИРАЙТЕ СВОЙ РИТМ</p>
        <h1>
          Автомобили
          <br />
          для ваших поездок
        </h1>
      </header>
      <ConsumptionFilter value={range} onApply={onApply} />
      <div className="section-heading">
        <h2>Все автомобили</h2>
        <span
          role="status"
          aria-label={`Найдено автомобилей: ${automobiles.length}`}
        >
          {automobiles.length}
        </span>
      </div>
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
