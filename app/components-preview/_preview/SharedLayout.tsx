import { Suspense } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { AudiencePanel } from "@/components/AudiencePanel";
import { Badge } from "@/components/Badge";
import { BridgeAiPreview } from "@/components/BridgeAiPreview";
import { CtaBand } from "@/components/CtaBand";
import { FeatureGrid } from "@/components/FeatureGrid";
import { JourneySteps } from "@/components/JourneySteps";
import { ProgrammeCards } from "@/components/ProgrammeCard";
import { ServiceCard } from "@/components/ServiceCard";
import { StatList } from "@/components/StatItem";
import { StatusPill } from "@/components/StatusPill";
import { StoryCard } from "@/components/StoryCard";
import { TalentCard } from "@/components/TalentCard";
import { bridgeAi, ecosystem, finalCta, howItWorks, pathways, talent, trust } from "@/content/home";
import { articles } from "@/data/articles";
import { programmes } from "@/data/programmes";
import { talentProfiles } from "@/data/talent";
import { Demo, Section } from "./Section";

// Step 3: the shared building blocks of the public site, with real homepage content.
export function SharedLayout() {
  return (
    <Section
      id="shared"
      eyebrow="Step 3"
      title="Shared layout"
      note="The header and footer of this page are the new versions. Below: every card type, the section heading, stats, the CTA band and the labels, as they appear across the public site."
    >

      <Demo label="Labels" className="flex flex-wrap items-center gap-3">
        <StatusPill status="open" />
        <StatusPill status="upcoming" />
        <StatusPill status="closed" />
        <StatusPill status="archived" />
        <Badge kind="comingSoon" />
        <Badge kind="preview" />
        <Badge kind="sampleProfile" />
      </Demo>

      <Demo label="Stats">
        <StatList stats={trust.stats} />
      </Demo>

      <Demo label="Service cards">
        <ul className="grid gap-6 lg:grid-cols-3">
          {ecosystem.cards.map((c) => (
            <li key={c.title}>
              <ServiceCard {...c} />
            </li>
          ))}
        </ul>
      </Demo>

      <Demo label="Audience panels">
        <ul className="grid gap-6 md:grid-cols-2">
          {pathways.panels.map((p) => (
            <li key={p.audience}>
              <AudiencePanel {...p} />
            </li>
          ))}
        </ul>
      </Demo>

      <Demo label="Programme cards" hint="Status is calculated from today's date">
        <Suspense fallback={<div className="min-h-96" />}>
          <ProgrammeCards programmes={programmes} />
        </Suspense>
      </Demo>

      <Demo label={`Talent cards · ${talent.headline}`}>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {talentProfiles.slice(0, 3).map((p) => (
            <li key={p.id}>
              <TalentCard profile={p} />
            </li>
          ))}
        </ul>
      </Demo>

      <Demo label="Article and story cards">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 2).map((a) => (
            <li key={a.id}>
              <ArticleCard article={a} />
            </li>
          ))}
          <li>
            <StoryCard />
          </li>
        </ul>
      </Demo>

      <Demo label="Feature grid" hint="Used on the audience and programme pages">
        <FeatureGrid items={howItWorks.steps.map((s) => ({ title: s.title, description: s.description }))} columns={4} numbered numberLabel="Step" />
      </Demo>

      <Demo label="Journey steps" className="rounded-xl bg-section-tint p-6 md:p-10">
        <JourneySteps steps={howItWorks.steps} />
      </Demo>

      <Demo label="Bridge AI preview panel" className="max-w-xl">
        <BridgeAiPreview capabilities={bridgeAi.capabilities} />
      </Demo>

      <Demo label="CTA band">
        <CtaBand {...finalCta} />
      </Demo>
    </Section>
  );
}
