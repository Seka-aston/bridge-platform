"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { partners, type Partner } from "@/content/home";
import { cn } from "@/lib/utils";

/*
  Partner logo strip (Aston, 11 Nov 2026), after Andela's "Trusted by" band: a short centred
  heading and two full-width rows of logo tiles scrolling in opposite directions.
  - Logos are grey until hovered. Logos are pictures of names, so contrast rules don't apply to
    them; each one's alt text is the organisation's name.
  - Moving content needs a way to stop it (WCAG 2.2.2): rows pause on hover and keyboard focus,
    and the Pause button stops both. With reduced motion the rows don't move at all and wrap
    into a still grid, so every logo stays visible.
  - No top padding: the section follows the white trust figures, so their bottom padding is the gap.
  - Each row is drawn four times so wide screens never see the end of it; the loop moves by
    half (two copies). Screen readers hear the list once.
*/

const COPIES = 4;

// Every logo gets roughly the same visual weight: wide wordmarks are drawn shorter, compact
// ones taller (height from the logo's proportions, kept between 20 and 56px; 80% on phones).
const AREA = 3600;
function logoHeight({ width, height }: Partner["logo"]) {
  return Math.round(Math.min(56, Math.max(20, Math.sqrt(AREA / (width / height)))));
}

function Logo({ p, copy }: { p: Partner; copy: boolean }) {
  return (
    <Image
      src={p.logo.src}
      alt={copy || p.mark ? "" : p.name}
      width={p.logo.width}
      height={p.logo.height}
      unoptimized
      style={p.mark ? undefined : { height: `calc(${logoHeight(p.logo)}px * var(--logo-scale))` }}
      className={cn(
        "w-auto max-w-full object-contain opacity-75 grayscale transition group-hover:opacity-100 group-hover:grayscale-0",
        p.mark && "h-8 md:h-9",
        p.invert && "invert",
      )}
    />
  );
}

function LogoList({ row, copy }: { row: Partner[]; copy: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className={
        copy
          ? "flex shrink-0 gap-4 pr-4 motion-reduce:hidden"
          : "flex shrink-0 gap-4 pr-4 motion-reduce:mx-auto motion-reduce:max-w-content motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-gutter"
      }
    >
      {row.map((p) => (
        <li key={p.name} className="group flex [--logo-scale:0.8] md:[--logo-scale:1] h-16 w-40 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-muted px-5 md:h-20 md:w-52 md:px-7">
          <Logo p={p} copy={copy} />
          {p.mark && (
            <span className="text-sm leading-tight font-bold text-muted-foreground">
              <span aria-hidden>{p.label ?? p.name}</span>
              {!copy && <span className="sr-only">{p.name}</span>}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function PartnerLogos() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="partners" aria-labelledby="partners-title" data-paused={paused || undefined} className="overflow-hidden bg-background pb-section-mobile md:pb-section">
      <h2 id="partners-title" className="mx-auto max-w-content px-gutter text-center text-lg font-semibold text-pretty text-heading">
        {partners.heading}
      </h2>

      <div className="mt-10 space-y-4">
        {partners.rows.map((row, i) => (
          <div key={i} className="logo-marquee flex w-max motion-reduce:block motion-reduce:w-auto" data-reverse={i % 2 === 1 || undefined}>
            {Array.from({ length: COPIES }, (_, c) => (
              <LogoList key={c} row={row} copy={c > 0} />
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-content justify-end px-gutter motion-reduce:hidden">
        <Button variant="ghost" size="sm" onClick={() => setPaused((v) => !v)}>
          {paused ? <Play data-icon="inline-start" aria-hidden /> : <Pause data-icon="inline-start" aria-hidden />}
          {paused ? partners.play : partners.pause}
        </Button>
      </div>
    </section>
  );
}
