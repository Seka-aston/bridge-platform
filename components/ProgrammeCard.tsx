import { connection } from "next/server";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import Image from "next/image";
import { prototypeMode } from "@/content/site";
import { programmeCardText as t } from "@/content/ui";
import type { Programme } from "@/data/programmes";
import { formatDate, programmeStatus, todayInKigali, type ProgrammeStatus } from "@/lib/programmes";

/*
  Programme card (CLAUDE.md section 7, component 8; spec 4.2.7).
  Status (Open, Upcoming, Closed, Archived) is calculated from the dates.
  Closed and archived cards never show a deadline or an apply button.
  `featured` gives Bridge Ventures Lab a wide, side-by-side layout.
*/

export { StatusPill } from "@/components/StatusPill";
import { StatusPill } from "@/components/StatusPill";

type ProgrammeCardProps = { programme: Programme; status: ProgrammeStatus; featured?: boolean };

export function ProgrammeCard({ programme: p, status, featured = false }: ProgrammeCardProps) {
  if (!p.approved && !prototypeMode) return null;
  const dateLine = t.dateLine[status].replace(
    "{date}",
    formatDate(status === "upcoming" ? p.opensOn : p.closesOn),
  );
  const details: [string, string][] = [
    [t.labels.audience, p.audience],
    [t.labels.format, p.format],
    [t.labels.location, p.location],
  ];

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-card border border-gray-200 bg-white shadow-card ${
        featured ? "lg:flex-row" : ""
      }`}
    >
      <div className={featured ? "lg:w-5/12" : ""}>
        {p.image ? (
          <Image
            src={p.image.src}
            alt={p.image.alt}
            width={800}
            height={450}
            className={`aspect-video w-full object-cover ${featured ? "lg:h-full" : ""}`}
          />
        ) : (
          <ImagePlaceholder className={`aspect-video w-full ${featured ? "lg:aspect-auto lg:h-full" : ""}`} />
        )}
      </div>

      <div className={`flex flex-1 flex-col p-6 ${featured ? "md:p-10" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={status} />
          {featured && (
            <span className="text-eyebrow uppercase text-green-700">{t.featuredLabel}</span>
          )}
          {!p.approved && <Badge kind="draft" />}
        </div>

        <h3 className={`mt-4 text-navy-900 ${featured ? "text-h2-mobile md:text-h2" : "text-h3"}`}>{p.name}</h3>
        <p className={`mt-2 text-gray-700 ${featured ? "text-body-lg" : ""}`}>{p.summary}</p>

        <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-gray-200 pt-6 sm:grid-cols-[auto_1fr]">
          {details.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-semibold text-navy-900">{label}</dt>
              <dd className="text-gray-700">{value}</dd>
            </div>
          ))}
          <div className="contents">
            <dt className="font-semibold text-navy-900">{t.labels.eligibility}</dt>
            <dd className="text-gray-700">
              <ul className="list-disc space-y-1 pl-5">
                {p.eligibility.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className={`mt-auto flex gap-4 pt-6 ${featured ? "flex-wrap items-center justify-between" : "flex-col items-start"}`}>
          <p className="font-semibold text-gray-800">{dateLine}</p>
          {status === "open" ? (
            <Button href={`/programmes/${p.id}`}>{t.cta.open}</Button>
          ) : (
            <Button variant="text" href={`/programmes/${p.id}`}>
              {t.cta.other}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

/*
  Works out today's date when the page is requested (not when the site was built),
  so a programme's status changes on the right day without a new deploy.
  Wrap in <Suspense> where used.
*/
export async function ProgrammeCards({
  programmes,
  showFeatured = true,
  hideArchived = false,
}: {
  programmes: Programme[];
  showFeatured?: boolean;
  // The homepage hides archived programmes; they belong in the full programme listing.
  hideArchived?: boolean;
}) {
  await connection();
  const today = todayInKigali();
  const withStatus = programmes
    .map((p) => ({ p, status: programmeStatus(p, today) }))
    .filter(({ status }) => !(hideArchived && status === "archived"));
  // Ventures Lab is featured only "when relevant and available": while it is open or upcoming.
  const featured = showFeatured
    ? withStatus.find(({ p, status }) => p.featured && (status === "open" || status === "upcoming"))
    : undefined;
  const rest = withStatus.filter((x) => x !== featured);

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

// One programme with its status for today (e.g. the Ventures Lab page). Wrap in <Suspense>.
export async function ProgrammeCardById({ programmes, id, featured = false }: { programmes: Programme[]; id: string; featured?: boolean }) {
  await connection();
  const p = programmes.find((x) => x.id === id);
  if (!p) return null;
  return <ProgrammeCard programme={p} status={programmeStatus(p, todayInKigali())} featured={featured} />;
}
