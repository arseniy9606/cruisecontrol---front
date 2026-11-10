import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
import { FUEL_TILES, fuelFeedPath } from "../Routes";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../components/FuelImage";
import CarIcon from "../components/CarIcon";
interface Props {
  automobiles: FuelConsumption[];
}
export default function FuelFeedPage({ automobiles }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const automobile = automobiles.find((item) => String(item.id) === id);
  // Эффект сбрасывает локальное состояние при смене карточки и задаёт заголовок вкладки.
  useEffect(() => {
    setExpanded(false);
    setVideoFailed(false);
    document.title = automobile
      ? `${automobile.name} — Расход топлива`
      : "Расход топлива автомобилей";
    return () => {
      document.title = "Расход топлива автомобилей";
    };
  }, [automobile]);
  if (!automobile)
    return (
      <main className="empty feed-empty">
        <h1>{automobiles.length ? "Автомобиль не найден" : "Лента пуста"}</h1>
        <p>Выберите автомобиль в плитке или измените фильтр.</p>
        <Button onClick={() => navigate(FUEL_TILES)}>К плитке</Button>
      </main>
    );
  const next =
    automobiles[(automobiles.indexOf(automobile) + 1) % automobiles.length];
  return (
    <main className="feed-page">
      <video
        key={automobile.id}
        className="fuel-video"
        autoPlay
        muted
        loop
        playsInline
        poster={automobile.image_url || DEFAULT_IMAGE}
        src={
          videoFailed || !automobile.video_url
            ? DEFAULT_VIDEO
            : automobile.video_url
        }
        onError={() => setVideoFailed(true)}
        aria-label={`Видео: ${automobile.name}`}
      />
      <aside className="feed-facts" aria-label="Параметры автомобиля">
        <div>
          <CarIcon name="tank" />
          <strong>
            {automobile.fuel_tank_volume.toLocaleString("ru-RU", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </strong>
          <small>объём бака, л</small>
        </div>
        <div>
          <CarIcon name="fuel" />
          <strong>{formatFuel(automobile.consumption_rate)}</strong>
          <small>л/100 км</small>
        </div>
        <div aria-label={`${automobile.likes_count} отметок нравится`}>
          <CarIcon name="heart" />
          <strong>{automobile.likes_count}</strong>
        </div>
        <Button
          className="next-car"
          aria-label="Следующий автомобиль"
          title="Следующий автомобиль"
          onClick={() => navigate(fuelFeedPath(next.id))}
        >
          <CarIcon name="next" />
        </Button>
      </aside>
      <section className="feed-description">
        <h1>{automobile.name}</h1>
        <p className={expanded ? "" : "clamped"}>{automobile.description}</p>
        <Button
          variant="link"
          className="expand"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Меньше" : "Ещё"}
        </Button>
      </section>
    </main>
  );
}
