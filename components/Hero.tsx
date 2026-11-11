import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/HeroVisual";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Display, Eyebrow, Lead } from "@/components/ui/typography";
import { hero, heroAi } from "@/content/home";

/*
  Homepage hero (spec 4.2.3), rebuilt from Aston's Figma hero (9 Nov 2026): a deep green gradient
  with amber highlights, glass details and a map of Africa. Spec copy is kept unchanged.

  - The section slides up under the sticky header (-mt-16), which is see-through over the hero
    until the visitor scrolls (Header.tsx).
  - Three CTAs from the spec, plus a Bridge AI preview bar. The bar is a link to the Bridge AI
    page marked "Coming soon", not a chat input (content rule 3).
  - Buttons keep the site's 8px corners (Aston, 9 Nov 2026).
*/

// Words from this point on are amber, like "TVET Students" in the Figma.
const HIGHLIGHT_FROM = "Real-World";

function Headline() {
  const words = hero.headline.split(" ");
  const cut = words.indexOf(HIGHLIGHT_FROM);
  const render = (list: string[]) =>
    list.map((word, i) => (
      <span key={i}>
        {i > 0 && " "}
        {/* Keep hyphenated words such as "Real-World" on one line. */}
        {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
      </span>
    ));
  if (cut < 0) return <>{render(words)}</>;
  return (
    <>
      {render(words.slice(0, cut))} <span className="text-brand-amber">{render(words.slice(cut))}</span>
    </>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="surface-green relative isolate -mt-16 overflow-hidden pt-16">
      {/* Soft green light behind the headline (Figma glow) */}
      <div aria-hidden className="pointer-events-none absolute top-[4%] -left-[35%] -z-10 opacity-25 h-[45%] w-[130%] lg:top-[18%] lg:-left-[10%] lg:h-[62%] lg:w-[52%]">
        <div className="absolute inset-[-34.62%_-25.71%]">
          <Image src="/hero/glow-left.svg" alt="" fill unoptimized />
        </div>
      </div>

      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-gutter pt-12 pb-section-mobile md:pt-16 md:pb-section lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 py-1.5 pr-3.5 pl-2">
            <span aria-hidden className="size-2 rounded-full bg-brand-amber" />
            <Eyebrow as="span">{hero.eyebrow}</Eyebrow>
          </p>
          <Display id="hero-title" className="mt-6 tracking-tight text-balance">
            <Headline />
          </Display>
          <Lead className="mt-6 max-w-xl text-pretty text-muted-foreground">{hero.supporting}</Lead>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" variant="inverse">
              <Link href={hero.primary.href}>
                {hero.primary.label} <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="xl" variant="on-navy">
              <Link href={hero.secondary.href}>
                {hero.secondary.label} <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </div>
          <p className="mt-5">
            <Button asChild variant="link" size="lg">
              <Link href={hero.additional.href}>
                {hero.additional.label} <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </p>

          {/* Bridge AI preview: looks like the Figma's ask bar, but is a link (no live chat yet). */}
          <Link
            href={heroAi.href}
            aria-label={heroAi.label}
            className="group mt-8 flex w-full max-w-xl items-center gap-3 rounded-lg border border-white/30 bg-white/12 py-1.5 pr-1.5 pl-4 backdrop-blur-sm transition-colors hover:bg-white/18 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Sparkles aria-hidden className="size-5 shrink-0 text-brand-amber" />
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{heroAi.prompt}</span>
            <Badge kind="comingSoon" className="shrink-0" />
            <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-amber text-brand-navy transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
