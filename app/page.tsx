import { Suspense } from "react";
import { AudiencePanel } from "@/components/AudiencePanel";
import { ArticleCard } from "@/components/ArticleCard";
import { BridgeAiPreview } from "@/components/BridgeAiPreview";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { CtaBand } from "@/components/CtaBand";
import { Hero } from "@/components/Hero";
import { HomeSection, SectionTop } from "@/components/HomeSection";
import { JourneySteps } from "@/components/JourneySteps";
import { ProgrammeCards } from "@/components/ProgrammeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { StatList } from "@/components/StatItem";
import { StoryCard } from "@/components/StoryCard";
import { TalentCard } from "@/components/TalentCard";
import {
  bridgeAi,
  ecosystem,
  finalCta,
  howItWorks,
  impact,
  insights,
  pathways,
  programmes,
  talent,
  trust,
} from "@/content/home";
import { prototypeMode } from "@/content/site";
import { articles } from "@/data/articles";
import { programmes as programmeData } from "@/data/programmes";
import { stories } from "@/data/stories";
import { talentProfiles } from "@/data/talent";

/*
  Bridge homepage: the 13 sections of spec 4.2, in order (CLAUDE.md section 6).
  The header (1) and footer (13) come from app/layout.tsx.
  Backgrounds alternate white and light green; navy for the hero and final band.
*/

export default function Home() {
  const visibleStories = stories.filter((s) => s.approved || prototypeMode);
  const showImpact = visibleStories.length > 0 || prototypeMode;
  const visibleArticles = articles.filter((a) => a.approved || prototypeMode);

  return (
    <main id="main" className="flex-1">
      {/* 2. Hero */}
      <Hero />

      {/* 3. Trust and credibility */}
      <HomeSection id="trust" labelledBy="trust-title">
        <SectionHeading id="trust-title" title={trust.heading} supporting={trust.supporting} />
        <div className="mt-12">
          <StatList stats={trust.stats} />
        </div>
      </HomeSection>

      {/* 4. The Bridge ecosystem */}
      <HomeSection id="ecosystem" labelledBy="ecosystem-title" tone="green">
        <SectionHeading
          id="ecosystem-title"
          eyebrow={ecosystem.eyebrow}
          title={ecosystem.headline}
          supporting={ecosystem.supporting}
        />
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {ecosystem.cards.map((c) => (
            <li key={c.title}>
              <ServiceCard {...c} />
            </li>
          ))}
        </ul>
      </HomeSection>

      {/* 5. Audience pathways */}
      <HomeSection id="pathways" labelledBy="pathways-title">
        <SectionHeading id="pathways-title" title={pathways.headline} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {pathways.panels.map((p) => (
            <li key={p.audience}>
              <AudiencePanel {...p} />
            </li>
          ))}
        </ul>
      </HomeSection>

      {/* 6. Programmes and Ventures Lab */}
      <HomeSection id="programmes" labelledBy="programmes-title" tone="green">
        <SectionTop
          heading={<SectionHeading id="programmes-title" title={programmes.heading} />}
          action={
            <Button variant="text" href={programmes.cta.href}>
              {programmes.cta.label}
            </Button>
          }
        />
        <div className="mt-12">
          <Suspense fallback={<div className="min-h-96" />}>
            <ProgrammeCards programmes={programmeData} hideArchived />
          </Suspense>
        </div>
      </HomeSection>

      {/* 7. Talent discovery */}
      <HomeSection id="talent" labelledBy="talent-title">
        <SectionHeading id="talent-title" eyebrow={talent.eyebrow} title={talent.headline} supporting={talent.supporting} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {talentProfiles.slice(0, 3).map((p) => (
            <li key={p.id}>
              <TalentCard profile={p} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <Button href={talent.primary.href} size="lg">
            {talent.primary.label}
          </Button>
          <Button href={talent.secondary.href} variant="secondary" size="lg">
            {talent.secondary.label}
          </Button>
        </div>
      </HomeSection>

      {/* 8. Bridge AI (product preview, labelled as in development) */}
      <HomeSection id="bridge-ai" labelledBy="bridge-ai-title" tone="green">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge kind="preview" />
            <SectionHeading
              id="bridge-ai-title"
              eyebrow={bridgeAi.eyebrow}
              title={bridgeAi.headline}
              supporting={bridgeAi.supporting}
              className="mt-6"
            />
            <div className="mt-8">
              <Button variant="text" href={bridgeAi.cta.href} size="lg">
                {bridgeAi.cta.label}
              </Button>
            </div>
          </div>
          <BridgeAiPreview capabilities={bridgeAi.capabilities} />
        </div>
      </HomeSection>

      {/* 9. Impact and learner stories (approved stories only) */}
      {showImpact && (
        <HomeSection id="impact" labelledBy="impact-title">
          <SectionTop
            heading={<SectionHeading id="impact-title" title={impact.headline} />}
            action={
              <Button variant="text" href={impact.cta.href}>
                {impact.cta.label}
              </Button>
            }
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleStories.length > 0 ? (
              visibleStories.map((s) => (
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

      {/* 10. How Bridge works */}
      <HomeSection id="how-it-works" labelledBy="how-title" tone="green">
        <SectionHeading id="how-title" title={howItWorks.headline} align="center" />
        <div className="mt-12">
          <JourneySteps steps={howItWorks.steps} />
        </div>
        <div className="mt-12 flex justify-center">
          <Button href={howItWorks.cta.href} size="lg">
            {howItWorks.cta.label}
          </Button>
        </div>
      </HomeSection>

      {/* 11. Insights and resources */}
      {visibleArticles.length > 0 && (
        <HomeSection id="insights" labelledBy="insights-title">
          <SectionTop
            heading={<SectionHeading id="insights-title" title={insights.headline} />}
            action={
              <Button variant="text" href={insights.cta.href}>
                {insights.cta.label}
              </Button>
            }
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((a) => (
              <li key={a.id}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </HomeSection>
      )}

      {/* 12. Final conversion */}
      <section aria-label={finalCta.headline} className="bg-white">
        {/* Top spacing comes from the white Insights section above; add our own if that section is hidden. */}
        <div
          className={`mx-auto max-w-content px-gutter pb-section-mobile md:pb-section ${
            visibleArticles.length > 0 ? "" : "pt-section-mobile md:pt-section"
          }`}
        >
          <CtaBand {...finalCta} />
        </div>
      </section>
    </main>
  );
}
