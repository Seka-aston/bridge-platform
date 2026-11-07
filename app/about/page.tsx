import type { Metadata } from "next";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatList } from "@/components/StatItem";
import { about as c } from "@/content/pages";

export const metadata: Metadata = { title: "About Bridge", description: c.header.supporting };

export default function AboutPage() {
  const blocks = [c.mission, c.vision, c.background];
  return (
    <main id="main" className="flex-1">
      <PageHeader eyebrow={c.header.eyebrow} title={c.header.title} supporting={c.header.supporting} />

      <HomeSection id="mission" labelledBy="mission-title">
        <h2 id="mission-title" className="sr-only">{c.mission.title}</h2>
        <div className="grid gap-10 lg:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.title}>
              <span aria-hidden className="block h-1 w-8 rounded-full bg-green-500" />
              <h3 className="mt-4 text-h3 text-navy-900">{b.title}</h3>
              <p className="mt-2 text-body-lg text-gray-700">{b.description}</p>
            </div>
          ))}
        </div>
      </HomeSection>

      <HomeSection id="challenges" labelledBy="challenges-title" tone="green">
        <SectionHeading id="challenges-title" title={c.challenges.title} supporting={c.challenges.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.challenges.items} columns={2} />
        </div>
      </HomeSection>

      <HomeSection id="trust" labelledBy="trust-title">
        <SectionHeading id="trust-title" title={c.trust.heading} supporting={c.trust.supporting} />
        <div className="mt-12">
          <StatList stats={c.trust.stats} />
        </div>
      </HomeSection>

      <FinalBand />
    </main>
  );
}
