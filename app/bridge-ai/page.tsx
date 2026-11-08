import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { BridgeAiPreview } from "@/components/BridgeAiPreview";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { LinkButton } from "@/components/LinkButton";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { bridgeAiPage as c } from "@/content/pages";

export const metadata: Metadata = { title: "Bridge AI", description: c.supporting };

// Spec 4.2.9: presented as a development preview; no live chat interface.
export default function BridgeAiPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader eyebrow={c.eyebrow} title={c.headline} supporting={c.supporting}>
        <div className="mt-6">
          <Badge kind="preview" />
        </div>
      </PageHeader>

      <HomeSection id="capabilities" labelledBy="capabilities-title">
        <h2 id="capabilities-title" className="sr-only">{c.capabilitiesLabel}</h2>
        <div className="mx-auto max-w-3xl">
          <BridgeAiPreview capabilities={c.capabilities} />
        </div>
      </HomeSection>

      <HomeSection id="volunteer" labelledBy="volunteer-title" tone="green">
        <SectionHeading id="volunteer-title" title={c.volunteer.title} supporting={c.volunteer.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.volunteer.items} />
        </div>
        <div className="mt-10">
          <LinkButton href={c.volunteer.cta.href}>{c.volunteer.cta.label}</LinkButton>
        </div>
      </HomeSection>

      <FinalBand />
    </main>
  );
}
