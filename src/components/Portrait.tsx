type PortraitProps = {
  initials: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeMap = {
  sm: "size-12 text-base",
  md: "size-16 text-xl",
  lg: "size-28 text-4xl",
  xl: "size-40 text-6xl",
};

// Derive a stable hue from the name so each figure gets a consistent tint.
function hueFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function Portrait({ initials, name, size = "md", className = "" }: PortraitProps) {
  const hue = hueFromString(name);
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-sm ${sizeMap[size]} ${className}`}
      style={{
        backgroundColor: `oklch(0.94 0.02 ${hue})`,
      }}
      aria-hidden="true"
    >
      <span
        className="font-display font-semibold leading-none"
        style={{
          color: `oklch(0.4 0.12 ${hue})`,
        }}
      >
        {initials}
      </span>
      <span
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ backgroundColor: `oklch(0.42 0.13 ${hue})` }}
      />
    </div>
  );
}
