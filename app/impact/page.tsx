import type { Metadata } from "next";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatList } from "@/components/StatItem";
import { StoryCard } from "@/components/StoryCard";
import { impact } from "@/content/home";
import { impactPage as c } from "@/content/pages";
import { prototypeMode } from "@/content/site";
import { stories } from "@/data/stories";

export const metadata: Metadata = { title: "Bridge's Impact", description: c.trust.supporting };

// Spec 4.2.10: approved stories only; every quantitative outcome needs a source.
export default function ImpactPage() {
  const visible = stories.filter((s) => s.approved || prototypeMode);
  return (
    <main id="main" className="flex-1">
      <PageHeader title={impact.headline} />

      <HomeSection id="trust" labelledBy="trust-title">
        <SectionHeading id="trust-title" title={c.trust.heading} supporting={c.trust.supporting} />
        <div className="mt-12">
          <StatList stats={c.trust.stats} />
        </div>
      </HomeSection>

      {(visible.length > 0 || prototypeMode) && (
        <HomeSection id="stories" labelledBy="stories-title" tone="green">
          <h2 id="stories-title" className="sr-only">{impact.headline}</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {visible.length > 0 ? (
              visible.map((s) => (
                <li key={s.id}>
                  <StoryCard story={s} />
                </li>
              ))
            ) : (
              <li>
                <StoryCard />
              </li>
            )}
          </ul>
        </HomeSection>
      )}

      <HomeSection id="process" labelledBy="process-title">
        <SectionHeading id="process-title" title={c.storiesProcess.title} supporting={c.storiesProcess.supporting} draft />
        <div className="mt-12">
          <FeatureGrid items={c.storiesProcess.steps} numbered columns={4} />
        </div>
      </HomeSection>

      <HomeSection id="reporting" labelledBy="reporting-title" tone="green">
        <SectionHeading id="reporting-title" title={c.reporting.title} supporting={c.reporting.supporting} draft />
        <div className="mt-12">
          <FeatureGrid items={c.reporting.items} />
        </div>
      </HomeSection>

      <FinalBand />
    </main>
  );
}
