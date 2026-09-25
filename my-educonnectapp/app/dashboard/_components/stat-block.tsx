// components/dashboard/stat-block.tsx
export function StatBlock({
  label,
  value,
  accent = "teal",
}: {
  label: string;
  value: string | number;
  accent?: "teal" | "gold";
}) {
  const accentColor = accent === "teal" ? "var(--teal)" : "var(--gold)";
  return (
    <div className="border-l-2 border-line pl-4" style={{ borderLeftColor: accentColor }}>
      <p className="font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}