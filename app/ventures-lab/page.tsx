import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { PageHeader } from "@/components/PageHeader";
import { ProgrammeCardById } from "@/components/ProgrammeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { venturesLab as c } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { programmes } from "@/data/programmes";

export const metadata: Metadata = { title: "Ventures Lab", description: c.header.supporting };

const programme = programmes.find((p) => p.id === c.programmeId);
const detailHref = `/programmes/${c.programmeId}`;

export default function VenturesLabPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        eyebrow={c.header.eyebrow}
        title={c.header.title}
        supporting={c.header.supporting}
        actions={
          <>
            <Button href={detailHref} size="lg">{c.applyCta}</Button>
            <Button href={c.discoveryCta.href} size="lg" variant="outline">{c.discoveryCta.label}</Button>
          </>
        }
      >
        {prototypeMode && (
          <p className="mt-6 flex flex-wrap items-center gap-3 text-body-lg font-semibold text-navy-900">
            {c.figuresLine} <Badge kind="draft" />
          </p>
        )}
      </PageHeader>

      <HomeSection id="programme" labelledBy="programme-title">
        <h2 id="programme-title" className="sr-only">{programme?.name}</h2>
        <Suspense fallback={<div className="min-h-96" />}>
          <ProgrammeCardById programmes={programmes} id={c.programmeId} featured />
        </Suspense>
      </HomeSection>

      <HomeSection id="about-lab" labelledBy="about-lab-title" tone="green">
        <SectionHeading id="about-lab-title" title={c.aboutTitle} />
        <div className="mt-12">
          <FeatureGrid items={c.about} columns={2} />
        </div>
      </HomeSection>

      <HomeSection id="curriculum" labelledBy="curriculum-title">
        <SectionHeading id="curriculum-title" title={c.curriculum.title} supporting={c.curriculum.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.curriculum.weeks} numbered numberLabel="Week" />
        </div>
      </HomeSection>

      <HomeSection id="gains" labelledBy="gains-title" tone="green">
        <SectionHeading id="gains-title" title={c.gains.title} />
        <div className="mt-12">
          <FeatureGrid items={c.gains.items} columns={4} />
        </div>
      </HomeSection>

      <HomeSection id="process" labelledBy="process-title">
        <SectionHeading id="process-title" title={c.process.title} supporting={c.process.supporting} draft />
        <div className="mt-12">
          <FeatureGrid items={c.process.phases} numbered columns={4} />
        </div>
      </HomeSection>

      {programme && (
        <HomeSection id="eligibility" labelledBy="eligibility-title" tone="green">
          <SectionHeading id="eligibility-title" title={c.eligibilityTitle} supporting={c.eligibilityNote} draft />
          <ul className="mt-8 grid max-w-3xl gap-3">
            {programme.eligibility.map((e) => (
              <li key={e} className="flex gap-3 rounded-control bg-white p-4 text-gray-800">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" />
                {e}
              </li>
            ))}
          </ul>
        </HomeSection>
      )}

      <FinalBand
        headline={c.cta.title}
        supporting={undefined}
        primary={{ label: c.applyCta, href: detailHref }}
        secondary={c.discoveryCta}
        link={undefined}
      />
    </main>
  );
}
