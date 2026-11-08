import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button as UiButton } from "@/components/ui/button";

/*
  TRANSITION ADAPTER (redesign Step 3, 8 Nov 2026). Pages that have not been migrated yet still
  use this older Button API; it now draws the shadcn Button (components/ui/button.tsx), so every
  button on the site has the new look. New code uses components/ui/button directly. This file is
  deleted in Step 8 once nothing imports it.

  Old variant → shadcn variant: primary → default, secondary, outline, navy, ghost → on-navy,
  text → link with arrow, textOnDark → link with arrow in white. Old md/lg → lg/xl (16px text).
*/

type Variant = "primary" | "secondary" | "outline" | "navy" | "ghost" | "text" | "textOnDark";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  onDark?: boolean;
  shape?: "default" | "pill";
  className?: string;
};

const variantMap = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  navy: "navy",
  ghost: "on-navy",
  text: "link",
  textOnDark: "link",
} as const;

// On navy: white text for links and a white focus ring.
const onNavy = "focus-visible:outline-brand-navy-foreground";

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  onDark = false,
  shape = "default",
  className,
}: ButtonProps) {
  const isLink = variant === "text" || variant === "textOnDark";
  const dark = onDark || variant === "ghost" || variant === "textOnDark";
  const classes = cn(
    "group/legacy",
    shape === "pill" && !isLink && "rounded-full",
    variant === "textOnDark" && "text-brand-navy-foreground hover:text-brand-navy-foreground",
    dark && onNavy,
    className,
  );
  const content = (
    <>
      {children}
      {isLink && <ArrowRight data-icon="inline-end" aria-hidden className="transition-transform duration-150 group-hover/legacy:translate-x-0.5" />}
    </>
  );
  const common = { variant: variantMap[variant], size: size === "lg" ? ("xl" as const) : ("lg" as const), className: classes };

  if (href) {
    // A disabled link can't be followed, so it renders as text marked as disabled.
    if (disabled) {
      return (
        <UiButton {...common} asChild>
          <span role="link" aria-disabled="true" className="pointer-events-none opacity-50">
            {content}
          </span>
        </UiButton>
      );
    }
    return (
      <UiButton {...common} asChild>
        <Link href={href}>{content}</Link>
      </UiButton>
    );
  }
  return (
    <UiButton {...common} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </UiButton>
  );
}
