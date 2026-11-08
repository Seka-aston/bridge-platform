import type { Metadata } from "next";
import { Suspense } from "react";
import { LinkButton } from "@/components/LinkButton";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { JourneySteps } from "@/components/JourneySteps";
import { PageHeader } from "@/components/PageHeader";
import { ProgrammeCards } from "@/components/ProgrammeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { howItWorks } from "@/content/home";
import { forTalents as c } from "@/content/pages";
import { programmes } from "@/data/programmes";

export const metadata: Metadata = { title: "For Talents", description: c.header.body };

export default function ForTalentsPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        eyebrow={c.header.audience}
        title={c.header.headline}
        supporting={c.header.body}
        actions={
          <>
            <LinkButton href={c.primary.href}>{c.primary.label}</LinkButton>
            <LinkButton href={c.secondary.href} variant="outline">{c.secondary.label}</LinkButton>
          </>
        }
      />

      <HomeSection id="services" labelledBy="services-title">
        <SectionHeading id="services-title" eyebrow={c.services.eyebrow} title={c.services.headline} supporting={c.services.supporting} />
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {c.services.cards.map((card) => (
            <li key={card.title}>
              <ServiceCard {...card} />
            </li>
          ))}
        </ul>
      </HomeSection>

      <HomeSection id="support" labelledBy="support-title" tone="green">
        <SectionHeading id="support-title" eyebrow={c.support.eyebrow} title={c.support.title} supporting={c.support.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.support.items} columns={4} />
        </div>
      </HomeSection>

      <HomeSection id="programmes" labelledBy="programmes-title">
        <SectionHeading id="programmes-title" title={c.programmesHeading} />
        <div className="mt-12">
          <Suspense fallback={<div className="min-h-96" />}>
            <ProgrammeCards programmes={programmes} hideArchived />
          </Suspense>
        </div>
      </HomeSection>

      <HomeSection id="journey" labelledBy="journey-title" tone="green">
        <SectionHeading id="journey-title" title={howItWorks.headline} align="center" />
        <div className="mt-12">
          <JourneySteps steps={howItWorks.steps} />
        </div>
      </HomeSection>

      <FinalBand />
    </main>
  );
}
