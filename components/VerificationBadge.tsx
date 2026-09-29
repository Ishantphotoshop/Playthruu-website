import { VERIFICATION_LABEL, type Verification } from "@/lib/news";

// Confirmed / Reported / Rumor / Leak. Shown wherever a story appears so
// its certainty is never hidden; the dot colour doubles the text label,
// it doesn't replace it.
export default function VerificationBadge({ status }: { status: Verification }) {
  return (
    <span className={"news-verify is-" + status}>
      <span className="news-verify-dot" aria-hidden="true" />
      {VERIFICATION_LABEL[status]}
    </span>
  );
}
