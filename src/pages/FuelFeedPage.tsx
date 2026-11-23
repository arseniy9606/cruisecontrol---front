import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
import { FUEL_TILES, fuelFeedPath } from "../Routes";
import CarIcon from "../components/CarIcon";
import FuelVideo from "../components/FuelVideo";
import { useFuelDispatch, useFuelSelector } from "../store";
import { loadFuelConsumptionFeed, setFuelConsumptionLike } from "../store/fuelConsumptionThunks";

export default function FuelFeedPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useFuelDispatch();
  const automobile = useFuelSelector((state) => state.fuelConsumptions.feedAutomobile);
  const authenticated = useFuelSelector((state) => state.fuelUser.login !== null);
  const loadedNextId = useRef<string | null>(null);

  useEffect(() => {
    // При переходе по «Следующий» карточка уже загружена через feed?next=true.
    if (loadedNextId.current === id) {
      loadedNextId.current = null;
      return;
    }
    const request = dispatch(loadFuelConsumptionFeed({ id: id === undefined ? undefined : Number(id) }));
    return () => request.abort();
  }, [dispatch, authenticated, id]);

  const name = automobile?.name;
  useEffect(() => {
    document.title = name ? `${name} — Расход топлива` : "Расход топлива автомобилей";
    return () => { document.title = "Расход топлива автомобилей"; };
  }, [name]);

  async function nextAutomobile(currentId: number) {
    const result = await dispatch(loadFuelConsumptionFeed({ id: currentId, next: true }));
    if (loadFuelConsumptionFeed.fulfilled.match(result) && result.payload && String(result.payload.id) !== id) {
      loadedNextId.current = String(result.payload.id);
      navigate(fuelFeedPath(result.payload.id));
    }
  }

  if (!automobile) return (
    <main className="empty feed-empty">
      <h1>{id ? "Автомобиль не найден" : "Лента пуста"}</h1>
      <p>Выберите автомобиль в плитке.</p>
      <Button onClick={() => navigate(FUEL_TILES)}>К плитке</Button>
    </main>
  );

  return <FuelFeedCard key={automobile.id} automobile={automobile} authenticated={authenticated}
    onNext={() => nextAutomobile(automobile.id)}
    onLike={() => dispatch(setFuelConsumptionLike({ id: automobile.id, liked: !automobile.liked }))} />;
}

interface FuelFeedCardProps {
  automobile: FuelConsumption;
  authenticated: boolean;
  onNext: () => void;
  onLike: () => void;
}

function FuelFeedCard({ automobile, authenticated, onNext, onLike }: FuelFeedCardProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <main className="feed-page">
      <FuelVideo key={automobile.video_url} automobile={automobile} autoPlay />
      <aside className="feed-facts" aria-label="Параметры автомобиля">
        <div>
          <CarIcon name="tank" />
          <strong>{formatFuel(automobile.fuel_tank_volume)}</strong>
          <small>объём бака, л</small>
        </div>
        <div>
          <CarIcon name="fuel" />
          <strong>{formatFuel(automobile.consumption_rate)}</strong>
          <small>л/100 км</small>
        </div>
        {authenticated ? (
          <Button variant="link" className="feed-like" onClick={onLike} aria-pressed={automobile.liked}
            aria-label={automobile.liked ? "Убрать отметку «Нравится»" : "Поставить отметку «Нравится»"}>
            <CarIcon name="heart" />
            <strong>{automobile.likes_count}</strong>
          </Button>
        ) : (
          <div aria-label={`${automobile.likes_count} отметок нравится`}>
            <CarIcon name="heart" />
            <strong>{automobile.likes_count}</strong>
          </div>
        )}
        <Button className="next-car" aria-label="Следующий автомобиль" title="Следующий автомобиль" onClick={onNext}>
          <CarIcon name="next" />
        </Button>
      </aside>
      <section className="feed-description">
        <h1>{automobile.name}</h1>
        {automobile.description && (
          <>
            <p className={expanded ? "" : "clamped"}>{automobile.description}</p>
            <Button variant="link" className="expand" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
              {expanded ? "Меньше" : "Ещё"}
            </Button>
          </>
        )}
      </section>
    </main>
  );
}
