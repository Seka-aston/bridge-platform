import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Badge } from "@/components/Badge";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusPill } from "@/components/StatusPill";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Display, Lead } from "@/components/ui/typography";
import { programmeDetail as c } from "@/content/pages";
import { programmeCardText as t } from "@/content/ui";
import type { Programme } from "@/data/programmes";
import { formatDate, type ProgrammeStatus } from "@/lib/programmes";

// Programme detail layout. Presentational, so it renders on the server and, after an admin
// edit this session, in the browser. The apply form only appears while applications are open.
export function ProgrammeDetailView({ programme: p, status }: { programme: Programme; status: ProgrammeStatus }) {
  const dateLine = t.dateLine[status].replace("{date}", formatDate(status === "upcoming" ? p.opensOn : p.closesOn));
  const details: [string, string][] = [
    [t.labels.audience, p.audience],
    [t.labels.format, p.format],
    [t.labels.location, p.location],
  ];

  return (
    <>
      <section aria-labelledby="page-title" className="border-b bg-section-tint">
        <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
          <Button asChild variant="link" size="lg">
            <Link href={c.backLink.href}>
              <ArrowLeft data-icon="inline-start" aria-hidden /> {c.backLink.label}
            </Link>
          </Button>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            {!p.approved && <Badge kind="draft" approvalKey={`programme:${p.id}`} />}
          </div>
          <Display id="page-title" className="mt-4 max-w-3xl">
            {p.name}
          </Display>
          <Lead className="mt-6 max-w-3xl">{p.summary}</Lead>
          <p className="mt-6 text-lg font-semibold text-heading">{dateLine}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-content gap-12 px-gutter py-section-mobile md:py-section lg:grid-cols-[1fr_2fr]">
        <aside aria-label={c.detailsLabel} className="h-fit">
          <Card className="text-base">
            <CardContent>
              <dl className="space-y-5">
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-semibold text-heading">{label}</dt>
                    <dd className="mt-1">{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-sm font-semibold text-heading">{t.labels.eligibility}</dt>
                  <dd>
                    <ul className="mt-1 list-disc space-y-1 pl-4 marker:text-muted-foreground">
                      {p.eligibility.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>

        <section aria-labelledby="apply-title">
          {status === "open" ? (
            <>
              <SectionHeading id="apply-title" title={c.applyTitle} draft />
              <div className="mt-8">
                <ApplyForm programmeId={p.id} programmeName={p.name} />
              </div>
            </>
          ) : (
            <>
              <h2 id="apply-title" className="sr-only">
                {c.applyTitle}
              </h2>
              <Alert role="status" className="p-6">
                <Info />
                <AlertDescription className="text-base text-foreground">
                  {status === "upcoming" ? c.notOpen.upcoming.replace("{date}", formatDate(p.opensOn)) : c.notOpen[status]}
                </AlertDescription>
              </Alert>
            </>
          )}
        </section>
      </div>
    </>
  );
}
