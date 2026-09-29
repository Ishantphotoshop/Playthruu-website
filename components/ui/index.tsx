import type { CSSProperties } from "react";
import BrandMark from "@/components/BrandMark";
import { coverUrl, type Game, type Person, type Status } from "@/lib/showcase";

// The app's own building blocks, rebuilt for the website so the two read
// as one product: the same poster frame, tilted status stamp, masked star
// row, initials avatar and "who + rating" footer (see playthruu-app-deploy
// js/components.js and css/styles.css). Styles live in globals.css.

export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className={"wordmark wordmark--" + size}>
      <BrandMark className="wordmark__mark" />
      <span className="wordmark__word">PlayThruu</span>
    </span>
  );
}

export function Poster({
  game,
  size = "cover_big_2x",
  className = "",
  priority = false,
}: {
  game: Game;
  size?: "cover_big" | "cover_big_2x";
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={"poster " + className}>
      {/* IGDB serves fixed sizes, so a plain img with the right size is
          lighter than routing every cover through an image optimiser. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl(game.cover, size)}
        alt={game.title}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        width={264}
        height={374}
      />
    </span>
  );
}

const STAMP_LABEL: Record<Status, string> = {
  playing: "Playing",
  played: "Played",
  backlog: "Backlog",
  dropped: "Dropped",
};

export function Stamp({ status, className = "" }: { status: Status; className?: string }) {
  return <span className={"stamp stamp--" + status + " " + className}>{STAMP_LABEL[status]}</span>;
}

// Displays a rating the way the app does: full stars, and a half star cut
// down the middle with nothing after it.
export function Stars({ rating, size = 16, of }: { rating: number; size?: number; of?: number }) {
  const count = of ?? Math.ceil(rating);
  return (
    <span className="stars" style={{ "--star-size": size + "px" } as CSSProperties} role="img" aria-label={rating + " out of 5 stars"}>
      {Array.from({ length: count }, function (_, i) {
        const n = i + 1;
        const fill = rating >= n ? "full" : rating >= n - 0.5 ? "half" : "empty";
        return <span key={n} className={"star star--" + fill} aria-hidden="true" />;
      })}
    </span>
  );
}

export function Avatar({ who, size = 24 }: { who: Person; size?: number }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.42, "--hue": who.hue } as CSSProperties}
      aria-hidden="true"
    >
      {who.name.slice(0, 1)}
    </span>
  );
}

// A friend's entry: poster, then who logged it and what they gave it.
export function FriendCard({
  game,
  who,
  rating,
  review,
  status,
}: {
  game: Game;
  who: Person;
  rating?: number;
  review?: boolean;
  status?: Status;
}) {
  return (
    <figure className="friend-card">
      <span className="friend-card__poster">
        <Poster game={game} size="cover_big" />
        {status && <Stamp status={status} className="friend-card__stamp" />}
      </span>
      <figcaption className="card-who">
        <Avatar who={who} size={22} />
        <span className="card-who__meta">
          <span className="card-who__name">{who.name}</span>
          {rating ? (
            <span className="card-who__stars">
              <Stars rating={rating} size={11} />
              {review && <ReviewMark />}
            </span>
          ) : (
            <span className="card-who__sub">{status === "playing" ? "playing now" : ""}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

function ReviewMark() {
  return (
    <svg className="card-who__review" viewBox="4 5 15 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label="wrote a review">
      <path d="M5 7h13M5 12h13M5 17h8" />
    </svg>
  );
}

// The app's ratings chart: ten half-star buckets as bars.
export function RatingBars({ counts, className = "" }: { counts: number[]; className?: string }) {
  const max = Math.max(...counts, 1);
  return (
    <span className={"rating-bars " + className} aria-hidden="true">
      {counts.map(function (c, i) {
        return <span key={i} className="rating-bars__bar" style={{ "--h": c / max } as CSSProperties} />;
      })}
    </span>
  );
}
