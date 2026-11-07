import Image from "next/image";

/*
  Bridge logo. Three versions supplied by Aston (7 Nov 2026):
  - green: symbol with green wordmark, for white and light backgrounds
  - amber: symbol with amber wordmark, for white and light backgrounds
  - white: symbol with white wordmark, for navy backgrounds
  These are PNGs for now; swap the files for SVGs when they are exported.
*/

export type LogoVariant = "green" | "amber" | "white";

const sources: Record<LogoVariant, string> = {
  green: "/brand/bridge-logo-green.png",
  amber: "/brand/bridge-logo-amber.png",
  white: "/brand/bridge-logo-white.png",
};

// Original artwork is 1329 × 430 px.
const RATIO = 1329 / 430;

type LogoProps = {
  variant?: LogoVariant;
  /** Height in pixels. Width follows the logo's proportions. */
  height?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({ variant = "green", height = 40, priority = false, className = "" }: LogoProps) {
  return (
    <Image
      src={sources[variant]}
      alt="Bridge"
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
