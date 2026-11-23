import { useState } from "react";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "./FuelImage";

interface Props {
  automobile: FuelConsumption;
  autoPlay?: boolean;
}

export default function FuelVideo({ automobile, autoPlay = false }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <video
      className={autoPlay ? "fuel-video" : "fuel-draft-video"}
      autoPlay={autoPlay}
      loop={autoPlay}
      muted={autoPlay}
      controls={!autoPlay}
      playsInline
      poster={automobile.image_url || DEFAULT_IMAGE}
      src={failed || !automobile.video_url ? DEFAULT_VIDEO : automobile.video_url}
      onError={() => setFailed(true)}
      aria-label={`Видео: ${automobile.name}`}
    />
  );
}
