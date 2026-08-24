export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <path d="M 20 18 V 62 A 40 40 0 0 0 100 62 V 18" fill="none" stroke="#F2F5FA" strokeWidth="16" strokeLinecap="round" />
      <path d="M 48 18 V 62 A 12 12 0 0 0 72 62 V 18" fill="none" stroke="#3E9BFF" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}
