"use client";

// Submit button that asks first when `confirm` is set — for the admin
// actions that are hard to undo (reject, delete, mark incorrect).
export default function ConfirmButton({
  confirm,
  className,
  children,
}: {
  confirm?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={function (e) {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
