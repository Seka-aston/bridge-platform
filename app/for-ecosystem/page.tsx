import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { forEcosystem as c } from "@/content/pages";

export const metadata: Metadata = { title: "For Ecosystem", description: c.header.body };

export default function ForEcosystemPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        eyebrow={c.header.audience}
        title={c.header.headline}
        supporting={c.header.body}
        actions={<Button href={c.primary.href} size="lg">{c.primary.label}</Button>}
      />

      <HomeSection id="partnerships" labelledBy="partnerships-title">
        <SectionHeading id="partnerships-title" eyebrow={c.intro.eyebrow} title={c.intro.title} supporting={c.intro.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.benefits.items} />
        </div>
      </HomeSection>

      <HomeSection id="mentor" labelledBy="mentor-title" tone="green">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="mentor-title" title={c.mentor.title} supporting={c.mentor.supporting} />
          <Button href={c.mentor.cta.href} size="lg" className="shrink-0">{c.mentor.cta.label}</Button>
        </div>
      </HomeSection>

      <FinalBand />
    </main>
  );
}
