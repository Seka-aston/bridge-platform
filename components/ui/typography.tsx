import * as React from "react"
import { cn } from "cn"

/*
  Bridge type scale (REDESIGN-BRIEF.md section 6). Use these instead of raw text sizes,
  so every page shares one scale.

  Marketing pages              Dashboards
  Display   48 / 60px, 800     PageTitle     24px, 600
  H2        30 / 36px, 700     SectionTitle  18px, 600
  H3        20px, 600          body          14px (text-sm), 400
  Lead      18px, 400          Caption       12px
  body      16px, 400
  Small     14px
  Eyebrow   12px, 600, uppercase, one style everywhere

  Headings use the heading token: navy, or white inside a surface-navy section. Paragraphs are capped at about 70 characters per line (max-w-prose).
*/

type Props<T extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<T> & { as?: keyof React.JSX.IntrinsicElements }

function make<T extends keyof React.JSX.IntrinsicElements>(defaultTag: T, slot: string, classes: string) {
  function Text({ as, className, ...props }: Props<T>) {
    const Tag = (as ?? defaultTag) as React.ElementType
    return <Tag data-slot={slot} className={cn(classes, className)} {...props} />
  }
  Text.displayName = slot
  return Text
}

// Marketing
export const Display = make("h1", "display", "font-heading text-5xl leading-[1.05] font-extrabold tracking-tight text-heading text-balance md:text-6xl")
export const H2 = make("h2", "h2", "font-heading text-3xl leading-tight font-bold tracking-tight text-heading text-balance md:text-4xl")
export const H3 = make("h3", "h3", "font-heading text-xl leading-snug font-semibold text-heading")
export const Lead = make("p", "lead", "max-w-prose text-lg leading-relaxed text-muted-foreground")
export const P = make("p", "p", "max-w-prose text-base leading-relaxed")
export const Small = make("p", "small", "text-sm leading-normal text-muted-foreground")
export const Eyebrow = make("p", "eyebrow", "text-xs leading-none font-semibold tracking-[0.08em] text-eyebrow-foreground uppercase")

// Dashboards
export const PageTitle = make("h1", "page-title", "font-heading text-2xl leading-tight font-semibold tracking-tight text-heading")
export const SectionTitle = make("h2", "section-title", "font-heading text-lg leading-snug font-semibold text-heading")
export const Caption = make("p", "caption", "text-xs leading-normal text-muted-foreground")
