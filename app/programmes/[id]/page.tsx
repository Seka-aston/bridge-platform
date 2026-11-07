import type { Metadata } from "next";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Badge } from "@/components/Badge";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { StatusPill } from "@/components/ProgrammeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { programmeDetail as c } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { programmeCardText as t } from "@/content/ui";
import { programmes } from "@/data/programmes";
import { formatDate, programmeStatus, todayInKigali } from "@/lib/programmes";

export function generateStaticParams() {
  return programmes.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/programmes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = programmes.find((x) => x.id === id);
  return p ? { title: p.name, description: p.summary } : {};
}

// Everything that depends on today's date (status, apply form) is decided at request time.
async function Detail({ id }: { id: string }) {
  await connection();
  const p = programmes.find((x) => x.id === id);
  if (!p || (!p.approved && !prototypeMode)) notFound();
  const status = programmeStatus(p, todayInKigali());
  const dateLine = t.dateLine[status].replace("{date}", formatDate(status === "upcoming" ? p.opensOn : p.closesOn));
  const details: [string, string][] = [
    [t.labels.audience, p.audience],
    [t.labels.format, p.format],
    [t.labels.location, p.location],
  ];

  return (
    <>
      <section aria-labelledby="page-title" className="bg-green-50">
        <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
          <Link
            href={c.backLink.href}
            className="inline-flex items-center gap-2 rounded-sm font-semibold text-green-700 hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            <ArrowLeft aria-hidden className="size-4" /> {c.backLink.label}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            {!p.approved && <Badge kind="draft" />}
          </div>
          <h1 id="page-title" className="mt-4 max-w-3xl text-balance text-display-mobile text-navy-900 md:text-display">
            {p.name}
          </h1>
          <p className="mt-6 max-w-3xl text-body-lg text-gray-700">{p.summary}</p>
          <p className="mt-6 text-body-lg font-semibold text-navy-900">{dateLine}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-content gap-12 px-gutter py-section-mobile md:py-section lg:grid-cols-[1fr_2fr]">
        <aside aria-label={c.detailsLabel} className="h-fit rounded-card border border-gray-200 p-6">
          <dl className="space-y-4">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold text-navy-900">{label}</dt>
                <dd className="text-gray-700">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="font-semibold text-navy-900">{t.labels.eligibility}</dt>
              <dd>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-700">
                  {p.eligibility.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
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
              <h2 id="apply-title" className="sr-only">{c.applyTitle}</h2>
              <p className="flex items-start gap-3 rounded-card border border-gray-200 bg-white p-6 text-body-lg text-gray-800">
                <Info aria-hidden className="mt-1 size-5 shrink-0 text-navy-900" />
                {status === "upcoming" ? c.notOpen.upcoming.replace("{date}", formatDate(p.opensOn)) : c.notOpen[status]}
              </p>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default async function ProgrammeDetailPage({ params }: PageProps<"/programmes/[id]">) {
  const { id } = await params;
  return (
    <main id="main" className="flex-1">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Detail id={id} />
      </Suspense>
    </main>
  );
}
