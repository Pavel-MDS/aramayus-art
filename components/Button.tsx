import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] uppercase tracking-[0.05em] font-medium rounded-md transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary:
      "bg-dark text-cream hover:bg-[#352519] active:bg-[#1a120e]",
    outline:
      "border border-border-subtle text-dark hover:border-dark bg-transparent",
    ghost: "text-terracotta hover:text-dark",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
