import Image from "next/image";
import { Button } from "@/components/Button";
import { hero } from "@/content/home";
import { prototypeMode } from "@/content/site";
import { homeText } from "@/content/ui";

/*
  Homepage hero (spec 4.2.3), in navy and green rather than the spec's emerald and amber
  (CLAUDE.md section 4). Eyebrow, H1, supporting line, three CTAs.
  The right-hand column is reserved for the hero ecosystem visual (Checkpoint 4).
*/

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-900">
      <div className="mx-auto grid max-w-content items-center gap-12 px-gutter py-section-mobile md:py-section lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-eyebrow uppercase text-white">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-balance text-display-mobile text-white md:text-display">
            {/* Keep hyphenated words such as "Real-World" on one line. */}
            {hero.headline.split(" ").map((word, i) => (
              <span key={i}>
                {i > 0 && " "}
                {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-body-lg text-white">{hero.supporting}</p>
          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Button href={hero.primary.href} size="lg" onDark>
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" size="lg" onDark>
              {hero.secondary.label}
            </Button>
          </div>
          <p className="mt-6">
            <Button href={hero.additional.href} variant="textOnDark" size="lg">
              {hero.additional.label}
            </Button>
          </p>
        </div>

        {prototypeMode && (
          <div className="relative flex min-h-80 items-center justify-center rounded-card border border-dashed border-white/40 p-8 lg:min-h-[28rem]">
            <Image
              aria-hidden
              src="/brand/bridge-symbol-on-navy.svg"
              alt=""
              width={129}
              height={215}
              unoptimized
              priority
              className="absolute h-3/4 w-auto opacity-15"
            />
            <p className="relative max-w-xs text-center text-white">{homeText.heroVisualPlaceholder}</p>
          </div>
        )}
      </div>
    </section>
  );
}
