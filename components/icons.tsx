import { useId } from "react";

type FeatureIconName = "gamepad" | "star" | "review" | "people" | "list";

function GamepadPath() {
  return (
    <>
      <path d="M6.5 8.5h11a4 4 0 0 1 3.9 3.1l.9 4A2.4 2.4 0 0 1 19 18.4l-2-2.4H7l-2 2.4a2.4 2.4 0 0 1-4.2-2.8l.9-4A4 4 0 0 1 6.5 8.5z" />
      <path d="M7.5 11.6v2.3M6.35 12.75h2.3" />
      <circle cx="15.6" cy="12" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="17.8" cy="14" r="1.05" fill="currentColor" stroke="none" />
    </>
  );
}

function StarPath() {
  return <path d="M12 2.3l3 6.4 6.9.9-5 4.9 1.2 6.9L12 17.9l-6.1 3.5 1.2-6.9-5-4.9 6.9-.9L12 2.3z" />;
}

function ReviewPath() {
  return <path d="M4 6h16M4 12h16M4 18h10" />;
}

function PeoplePath() {
  return (
    <>
      <circle cx="8.5" cy="8" r="3.2" />
      <path d="M2.5 20c1-3.4 3.2-5.3 6-5.3s5 1.9 6 5.3" />
      <circle cx="17" cy="8.5" r="2.6" />
      <path d="M15.5 14.5c2.2.2 3.9 1.8 4.8 4.7" />
    </>
  );
}

function ListPath() {
  return (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </>
  );
}

const FEATURE_PATHS: Record<FeatureIconName, () => React.JSX.Element> = {
  gamepad: GamepadPath,
  star: StarPath,
  review: ReviewPath,
  people: PeoplePath,
  list: ListPath,
};

export function FeatureIcon({ name }: { name: FeatureIconName }) {
  const Path = FEATURE_PATHS[name];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <Path />
    </svg>
  );
}

function Star({ fill, clipId }: { fill: "full" | "half" | "empty"; clipId: string }) {
  if (fill === "empty") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.6}>
        <StarPath />
      </svg>
    );
  }
  if (fill === "full") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <StarPath />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.6}>
        <StarPath />
      </g>
      <g fill="currentColor" stroke="none" clipPath={`url(#${clipId})`}>
        <StarPath />
      </g>
    </svg>
  );
}

export function StarRow({ rating, size = 15 }: { rating: number; size?: number }) {
  const uid = useId();
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span className="stars" style={{ ["--star-size" as string]: `${size}px` }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map(function (_, i) {
        const fillType = i < full ? "full" : i === full && hasHalf ? "half" : "empty";
        return <Star key={i} fill={fillType} clipId={`${uid}-star-${i}`} />;
      })}
    </span>
  );
}
