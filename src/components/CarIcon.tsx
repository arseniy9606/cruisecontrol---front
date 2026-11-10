type IconName =
  "feed" | "add" | "tiles" | "login" | "tank" | "fuel" | "heart" | "next";
const paths: Record<IconName, React.ReactNode> = {
  feed: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="4" />
      <path d="m10 8 6 4-6 4Z" />
    </>
  ),
  add: <path d="M12 4v16M4 12h16" />,
  tiles: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  login: (
    <>
      <path d="M14 3h6v18h-6M3 12h12m-5-5 5 5-5 5" />
    </>
  ),
  tank: <path d="M5 4h14v16H5zM8 4V2h8v2M8 9h8M9 16h6" />,
  fuel: (
    <path d="M4 21V4h9v17M2 21h13M4 10h9m0 3h3v5a2 2 0 0 0 4 0V8l-3-3M18 7l2 2" />
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  next: <path d="m8 5 8 7-8 7M19 5v14" />,
};
export default function CarIcon({ name }: { name: IconName }) {
  return (
    <svg
      className="car-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
