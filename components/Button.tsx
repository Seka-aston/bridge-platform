import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/*
  Bridge button (CLAUDE.md section 4, "Buttons").

  Variants: primary, secondary, ghost (on navy only), text (link with arrow).
  Sizes: md (8 × 24px padding, 16px text) and lg (12 × 32px, 18px text).
  States: hover, pressed, keyboard focus, disabled.

  Give it `href` to render a link, or leave it out to render a <button>.
  Set `onDark` when a primary, secondary or text button sits on navy, so the
  focus ring turns white. Ghost buttons always use the white ring.

  `previewState` is only for the /components-preview page: it shows a state
  (hover, pressed, focus) without the mouse or keyboard.
*/

export type ButtonVariant = "primary" | "secondary" | "outline" | "navy" | "ghost" | "text" | "textOnDark";
export type ButtonSize = "md" | "lg";
export type PreviewState = "hover" | "active" | "focus";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  onDark?: boolean;
  // "pill" = fully rounded, as in Aston's dashboard design. Default 8px corners.
  shape?: "default" | "pill";
  previewState?: PreviewState;
  className?: string;
};

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[color,background-color,transform] duration-150 select-none";

// Padding is left off text buttons so they line up with body copy.
const sizes: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { md: "border px-6 py-2 text-body", lg: "border px-8 py-3 text-lg" },
  secondary: { md: "border px-6 py-2 text-body", lg: "border px-8 py-3 text-lg" },
  outline: { md: "border px-6 py-2 text-body", lg: "border px-8 py-3 text-lg" },
  navy: { md: "border px-6 py-2 text-body", lg: "border px-8 py-3 text-lg" },
  ghost: { md: "border px-6 py-2 text-body", lg: "border px-8 py-3 text-lg" },
  // -mx-1 px-1 gives the focus ring room without shifting the link's alignment.
  text: { md: "-mx-1 px-1 text-body", lg: "-mx-1 px-1 text-lg" },
  textOnDark: { md: "-mx-1 px-1 text-body", lg: "-mx-1 px-1 text-lg" },
};

// Every class is written out in full so Tailwind can find it.
const looks: Record<ButtonVariant, { enabled: string; disabled: string }> = {
  primary: {
    enabled:
      "border-transparent bg-green-700 text-white shadow-soft hover:bg-green-800 active:bg-green-800 data-[preview-state=hover]:bg-green-800 data-[preview-state=active]:bg-green-800",
    disabled: "border-transparent bg-gray-200 text-gray-500",
  },
  secondary: {
    enabled:
      "border-transparent bg-green-50 text-green-700 hover:bg-green-500/15 hover:text-green-800 active:bg-green-500/15 active:text-green-800 data-[preview-state=hover]:bg-green-500/15 data-[preview-state=hover]:text-green-800 data-[preview-state=active]:bg-green-500/15 data-[preview-state=active]:text-green-800",
    disabled: "border-transparent bg-gray-200 text-gray-500",
  },
  // Secondary action on light-green backgrounds, where the green-50 Secondary fill would disappear.
  outline: {
    enabled:
      "border-green-700 bg-white text-green-700 hover:bg-green-50 hover:text-green-800 active:bg-green-50 active:text-green-800 data-[preview-state=hover]:bg-green-50 data-[preview-state=hover]:text-green-800 data-[preview-state=active]:bg-green-50 data-[preview-state=active]:text-green-800",
    disabled: "border-gray-200 bg-gray-200 text-gray-500",
  },
  // Navy action button from Aston's dashboard design ("Apply"). White on navy 10.9:1; hover lightens slightly.
  navy: {
    enabled:
      "border-transparent bg-navy-900 text-white hover:bg-navy-900/85 active:bg-navy-900/85 data-[preview-state=hover]:bg-navy-900/85 data-[preview-state=active]:bg-navy-900/85",
    disabled: "border-transparent bg-gray-200 text-gray-500",
  },
  ghost: {
    enabled:
      "border-white bg-transparent text-white hover:bg-white/10 active:bg-white/20 data-[preview-state=hover]:bg-white/10 data-[preview-state=active]:bg-white/20",
    disabled: "border-white/40 bg-transparent text-white/60",
  },
  text: {
    enabled:
      "rounded-sm text-green-700 underline-offset-4 hover:text-green-800 hover:underline active:text-green-800 data-[preview-state=hover]:text-green-800 data-[preview-state=hover]:underline data-[preview-state=active]:text-green-800",
    disabled: "rounded-sm text-gray-500",
  },
  // White link with arrow for navy backgrounds (green text is too low in contrast there).
  textOnDark: {
    enabled:
      "rounded-sm text-white underline-offset-4 hover:underline data-[preview-state=hover]:underline",
    disabled: "rounded-sm text-white/60",
  },
};

// Pressed buttons move down 1px. Text links don't move.
const press: Record<ButtonVariant, string> = {
  primary: "active:translate-y-px data-[preview-state=active]:translate-y-px",
  secondary: "active:translate-y-px data-[preview-state=active]:translate-y-px",
  outline: "active:translate-y-px data-[preview-state=active]:translate-y-px",
  navy: "active:translate-y-px data-[preview-state=active]:translate-y-px",
  ghost: "active:translate-y-px data-[preview-state=active]:translate-y-px",
  text: "",
  textOnDark: "",
};

const focusLight =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 data-[preview-state=focus]:outline-2 data-[preview-state=focus]:outline-offset-2 data-[preview-state=focus]:outline-navy-900";
const focusDark =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-[preview-state=focus]:outline-2 data-[preview-state=focus]:outline-offset-2 data-[preview-state=focus]:outline-white";

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
  previewState,
  className = "",
}: ButtonProps) {
  const dark = onDark || variant === "ghost" || variant === "textOnDark";
  const classes = [
    base,
    variant === "text" || variant === "textOnDark" ? "" : shape === "pill" ? "rounded-full" : "rounded-control",
    sizes[variant][size],
    disabled ? `${looks[variant].disabled} cursor-not-allowed` : `${looks[variant].enabled} ${press[variant]}`,
    dark ? focusDark : focusLight,
    className,
  ].join(" ");

  const content = (
    <>
      {children}
      {(variant === "text" || variant === "textOnDark") && (
        <ArrowRight
          aria-hidden
          className={`size-[1em] transition-transform duration-150 ${
            disabled ? "" : "group-hover:translate-x-0.5 group-data-[preview-state=hover]:translate-x-0.5"
          }`}
        />
      )}
    </>
  );

  const state = disabled ? undefined : previewState;

  if (href) {
    // A disabled link can't be followed, so it renders as plain text marked as disabled.
    if (disabled) {
      return (
        <span role="link" aria-disabled="true" className={classes}>
          {content}
        </span>
      );
    }
    return (
      <Link href={href} className={classes} data-preview-state={state}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} data-preview-state={state}>
      {content}
    </button>
  );
}
