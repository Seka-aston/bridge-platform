import Image from "next/image";

/*
  Bridge logo. Three SVG versions supplied by Aston (7 Nov 2026):
  - green: green wordmark (#3AAA6D), for white and light backgrounds. Used in the header.
  - amber: amber wordmark (#F8AC36), for white and light backgrounds.
  - white: white wordmark with a lighter symbol, for navy backgrounds.
*/

export type LogoVariant = "green" | "amber" | "white";

const sources: Record<LogoVariant, string> = {
  green: "/brand/bridge-logo-green.svg",
  amber: "/brand/bridge-logo-amber.svg",
  white: "/brand/bridge-logo-white.svg",
};

// Artwork is 665 × 215. The letters take up 40% of the height.
const RATIO = 665 / 215;

type LogoProps = {
  variant?: LogoVariant;
  /**
   * Height in pixels, or "header": 32px on mobile, 40px from 768px up
   * (letters 13px and 16px tall). Width follows the logo's proportions.
   */
  size?: number | "header";
  priority?: boolean;
  className?: string;
};

export function Logo({ variant = "green", size = "header", priority = false, className = "" }: LogoProps) {
  const header = size === "header";
  const height = header ? 40 : size;
  return (
    <Image
      src={sources[variant]}
      alt="Bridge"
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
      unoptimized
      className={`${header ? "h-8 w-auto md:h-10" : ""} ${className}`}
    />
  );
}
