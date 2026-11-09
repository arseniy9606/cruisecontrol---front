import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
import { FUEL_TILES, fuelFeedPath } from "../Routes";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../components/FuelImage";
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
        controls
        poster={automobile.image_url || DEFAULT_IMAGE}
        src={
          videoFailed || !automobile.video_url
            ? DEFAULT_VIDEO
            : automobile.video_url
        }
        onError={() => setVideoFailed(true)}
        aria-label={`Видео: ${automobile.name}`}
      />
      <div className="feed-top">
        <span>В движении</span>
        <span>
          {automobiles.indexOf(automobile) + 1} / {automobiles.length}
        </span>
      </div>
      <div className="feed-facts">
        <div>
          <strong>{formatFuel(automobile.consumption_rate)}</strong>
          <span>л/100 км</span>
        </div>
        <div>
          <strong>{formatFuel(automobile.fuel_tank_volume)}</strong>
          <span>бак, л</span>
        </div>
        <div>
          <strong>♡ {automobile.likes_count}</strong>
          <span>нравится</span>
        </div>
      </div>
      <section className="feed-description">
        <p className="eyebrow">РАСХОД ТОПЛИВА</p>
        <h1>{automobile.name}</h1>
        <p className={expanded ? "" : "clamped"}>{automobile.description}</p>
        <Button
          variant="link"
          className="expand"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Меньше" : "Больше"}
        </Button>
        <Button
          className="next-car"
          onClick={() => navigate(fuelFeedPath(next.id))}
        >
          Следующий автомобиль ↓
        </Button>
      </section>
    </main>
  );
}
