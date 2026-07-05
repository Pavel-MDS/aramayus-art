interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-[11px] px-3.5 py-2 rounded-full transition-colors whitespace-nowrap ${
        active
          ? "bg-dark text-cream"
          : "border border-border-subtle text-dark hover:border-dark"
      }`}
    >
      {label}
    </button>
  );
}
