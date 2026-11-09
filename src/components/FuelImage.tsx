import { useState } from "react";
export const DEFAULT_IMAGE = "/DefaultImage.jpg";
export const DEFAULT_VIDEO = "/DefaultVideo.mp4";
interface Props {
  source: string;
  name: string;
}
export default function FuelImage({ source, name }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !source ? DEFAULT_IMAGE : source}
      alt={name}
      onError={() => setFailed(true)}
    />
  );
}
