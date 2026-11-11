import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/Badge";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { StatusPill } from "@/components/StatusPill";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { H2, H3 } from "@/components/ui/typography";
import { prototypeMode } from "@/content/site";
import { programmeCardText as t } from "@/content/ui";
import type { Programme } from "@/data/programmes";
import { cn } from "@/lib/utils";
import { formatDate, type ProgrammeStatus } from "@/lib/programmes";

/*
  Programme card (spec 4.2.7). Presentational only, so it renders both on the server and in the
  browser (when an admin has edited programmes this session).
  Status (Open, Upcoming, Closed, Archived) is calculated from the dates by the caller.
  Closed and archived cards never show a deadline or an apply button.
  `featured` gives Bridge Ventures Lab a wide, side-by-side layout.
*/

// Every programme has its own page, including ones created in the admin dashboard this session.
const hrefFor = (p: Programme) => `/programmes/${p.id}`;

export type ProgrammeCardProps = { programme: Programme; status: ProgrammeStatus; featured?: boolean };

export function ProgrammeCard({ programme: p, status, featured = false }: ProgrammeCardProps) {
  if (!p.approved && !prototypeMode) return null;
  const dateLine = t.dateLine[status].replace("{date}", formatDate(status === "upcoming" ? p.opensOn : p.closesOn));
  const details: [string, string][] = [
    [t.labels.audience, p.audience],
    [t.labels.format, p.format],
    [t.labels.location, p.location],
  ];
  const Title = featured ? H2 : H3;

  return (
    <Card className={cn("h-full gap-0 py-0 text-base", featured && "lg:flex-row")}>
      <div className={cn("relative", featured && "lg:w-5/12 lg:shrink-0")}>
        {p.image?.logo ? (
          // A programme logo sits whole on a brand-green panel (the logo's own background), never cropped.
          <div className={cn("flex aspect-video w-full items-center justify-center bg-brand-green p-8", featured && "lg:aspect-auto lg:h-full lg:p-12")}>
            <Image src={p.image.src} alt={p.image.alt} width={p.image.logo.width} height={p.image.logo.height} className="h-auto w-full max-w-sm" />
          </div>
        ) : p.image ? (
          <Image src={p.image.src} alt={p.image.alt} width={800} height={450} style={p.image.position ? { objectPosition: p.image.position } : undefined} className={cn("aspect-video w-full object-cover", featured && "lg:h-full")} />
        ) : (
          <ImagePlaceholder className={cn("aspect-video w-full", featured && "lg:aspect-auto lg:h-full")} />
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-6", featured && "md:p-10")}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={status} />
          {featured && <UiBadge variant="featured">{t.featuredLabel}</UiBadge>}
          {!p.approved && <Badge kind="draft" approvalKey={`programme:${p.id}`} />}
        </div>

        <Title as="h3" className="mt-4">
          {p.name}
        </Title>
        <p className={cn("mt-2 text-muted-foreground", featured && "text-lg")}>{p.summary}</p>

        <Separator className="my-6" />
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
          {details.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-semibold text-heading">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div className="contents">
            <dt className="font-semibold text-heading">{t.labels.eligibility}</dt>
            <dd>
              <ul className="list-disc space-y-1 pl-4 marker:text-muted-foreground">
                {p.eligibility.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className={cn("mt-auto flex gap-4 pt-8", featured ? "flex-wrap items-center justify-between" : "flex-col items-start")}>
          <p className="text-sm font-semibold">{dateLine}</p>
          {status === "open" ? (
            <Button asChild size="lg">
              <Link href={hrefFor(p)}>{t.cta.open}</Link>
            </Button>
          ) : (
            <Button asChild variant="link" size="lg">
              <Link href={hrefFor(p)}>
                {t.cta.other} <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export type Arranged = { featured?: { p: Programme; status: ProgrammeStatus }; rest: { p: Programme; status: ProgrammeStatus }[] };

export function ProgrammeGrid({ featured, rest }: Arranged) {
  return (
    <div className="space-y-6">
      {featured && <ProgrammeCard programme={featured.p} status={featured.status} featured />}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map(({ p, status }) => (
          <li key={p.id}>
            <ProgrammeCard programme={p} status={status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
