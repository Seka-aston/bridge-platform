import type { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { JourneySteps } from "@/components/JourneySteps";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatList } from "@/components/StatItem";
import { howItWorks } from "@/content/home";
import { forSchools as c } from "@/content/pages";

export const metadata: Metadata = { title: "For Schools", description: c.header.body };

export default function ForSchoolsPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        eyebrow={c.header.audience}
        title={c.header.headline}
        supporting={c.header.body}
        actions={<LinkButton href={c.primary.href}>{c.primary.label}</LinkButton>}
      />

      <HomeSection id="challenges" labelledBy="challenges-title">
        <SectionHeading id="challenges-title" title={c.challenges.title} supporting={c.challenges.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.challenges.items} columns={2} />
        </div>
      </HomeSection>

      <HomeSection id="trust" labelledBy="trust-title" tone="green">
        <SectionHeading id="trust-title" title={c.trust.heading} supporting={c.trust.supporting} />
        <div className="mt-12">
          <StatList stats={c.trust.stats} />
        </div>
      </HomeSection>

      <HomeSection id="journey" labelledBy="journey-title">
        <SectionHeading id="journey-title" title={howItWorks.headline} align="center" />
        <div className="mt-12">
          <JourneySteps steps={howItWorks.steps} />
        </div>
      </HomeSection>

      <FinalBand />
    </main>
  );
}
