interface BadgeProps {
  children: React.ReactNode;
  tone?: "terracotta" | "dark" | "muted";
}

export function Badge({ children, tone = "terracotta" }: BadgeProps) {
  const tones: Record<string, string> = {
    terracotta: "bg-terracotta text-cream",
    dark: "bg-dark text-cream",
    muted: "bg-cream/90 text-muted",
  };

  return (
    <span
      className={`inline-block text-[10px] font-medium tracking-wide px-2.5 py-1 rounded ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
