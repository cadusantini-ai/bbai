interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 36, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="36" height="36" rx="8" fill="#1A1D27" />

      {/* Neural bolt — top node to mid-left */}
      <line x1="23" y1="7" x2="14" y2="19" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mid horizontal zig */}
      <line x1="14" y1="19" x2="20" y2="19" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mid to bottom node */}
      <line x1="20" y1="19" x2="12" y2="30" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" />

      {/* Primary neural nodes */}
      <circle cx="23" cy="7" r="3" fill="#00D4AA" />
      <circle cx="14" cy="19" r="2.5" fill="#00D4AA" />
      {/* Junction node — hollow ring = "AI" data processing */}
      <circle cx="20" cy="19" r="2" fill="#1A1D27" stroke="#00D4AA" strokeWidth="1.5" />
      <circle cx="12" cy="30" r="3" fill="#00D4AA" />

      {/* Radiating neural connections */}
      <circle cx="29" cy="13" r="1.5" fill="#00D4AA" opacity="0.45" />
      <line
        x1="23" y1="7" x2="29" y2="13"
        stroke="#00D4AA" strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.35"
      />
      <circle cx="6" cy="25" r="1.5" fill="#00D4AA" opacity="0.45" />
      <line
        x1="12" y1="30" x2="6" y2="25"
        stroke="#00D4AA" strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.35"
      />
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-0">
        <span
          style={{ color: "#00D4AA" }}
          className="font-extrabold text-[18px] tracking-tight leading-none"
        >
          BB
        </span>
        <span className="font-extrabold text-[18px] tracking-tight leading-none text-foreground">
          AI
        </span>
      </div>
      <p className="text-[9px] text-muted-foreground leading-none mt-0.5 tracking-[0.12em] uppercase">
        Health Platform
      </p>
    </div>
  );
}

export function Logo({
  iconSize = 32,
  className,
}: {
  iconSize?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoIcon size={iconSize} />
      <LogoWordmark />
    </div>
  );
}
