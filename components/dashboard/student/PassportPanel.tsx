import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/typography";
import { studentText } from "@/content/dashboard";
import { certificates, courses, passport, skills } from "@/data/student";

/*
  Skills Passport summary (redesign Step 7): a navy passport card (white text 10.9:1) with the
  rank chip (amber, navy text), verified-skill count, name and ID, then three figures.
*/

const t = studentText.passport;

export function PassportCard({ name }: { name: string }) {
  const verified = skills.filter((s) => s.verified).length;
  return (
    <div className="surface-navy relative overflow-hidden rounded-xl p-5">
      {/* Decorative brand-green arc in the corner */}
      <span aria-hidden className="pointer-events-none absolute -right-14 -bottom-20 size-44 rounded-full border-[18px] border-brand-green/25" />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase">{t.cardLabel}</p>
        <span title={t.rankSample} className="inline-flex items-center gap-1 rounded-full bg-brand-amber px-2 py-0.5 text-xs font-semibold text-brand-navy">
          <Award aria-hidden className="size-3.5" />
          {t.rank.replace("{n}", String(passport.rank))}
          <span className="sr-only"> ({t.rankSample})</span>
        </span>
      </div>
      <p className="relative mt-6 text-sm text-muted-foreground">{t.verifiedSoFar}</p>
      <p className="relative mt-1 flex items-baseline gap-2">
        <span className="font-heading text-4xl leading-none font-bold tabular-nums">{verified}</span>
        <span className="text-sm font-medium">{t.skillsUnit}</span>
      </p>
      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
        <p className="font-semibold">{name}</p>
        <p className="text-muted-foreground tabular-nums">
          {t.id} {passport.id}
        </p>
      </div>
    </div>
  );
}

export function PassportPanel({ name, href, completedLessons }: { name: string; href: string; completedLessons: ReactNode }) {
  const stats = [
    { value: courses.length, label: t.stats.enrolled },
    { value: completedLessons, label: t.stats.completed },
    { value: certificates.length, label: t.stats.certificates },
  ];
  return (
    <Card as="section" aria-labelledby="passport-title">
      <CardHeader>
        <SectionTitle id="passport-title">{t.title}</SectionTitle>
        <CardDescription>{t.subtitle}</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="icon-sm">
            <Link href={href} aria-label={t.open}>
              <ArrowUpRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <PassportCard name={name} />
        <dl className="grid grid-cols-3 divide-x rounded-lg border">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 p-3">
              <dt className="text-xs leading-tight text-muted-foreground">{s.label}</dt>
              <dd className="order-first text-xl leading-none font-semibold text-heading tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
