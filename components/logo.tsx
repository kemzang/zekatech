import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <span
      className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}
      aria-label="ZekaTech"
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-primary"
        aria-hidden
      >
        <rect
          width="40"
          height="40"
          rx="10"
          className="fill-primary/20"
        />
        {/* Z (ZekaTech) moderne */}
        <path
          d="M12 14h6l-6 12h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="14" r="2.5" className="fill-primary" />
        <path
          d="M26 24h6v4h-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={cn("text-foreground", textSize)}>
          ZekaTech
        </span>
      )}
    </span>
  );
}
