import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeSection } from "@/components/HomeSection";
import { ProgrammeCards } from "@/components/ProgrammeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TopicPage } from "@/components/TopicPage";
import { opportunitiesPage as c } from "@/content/pages";
import { programmes } from "@/data/programmes";

export const metadata: Metadata = { title: c.card.title, description: c.card.description };

export default function OpportunitiesPage() {
  return (
    <TopicPage title={c.card.title} description={c.card.description} capabilities={c.card.capabilities} actions={[c.action]}>
      <HomeSection id="programmes" labelledBy="programmes-title">
        <SectionHeading id="programmes-title" title={c.programmesHeading} />
        <div className="mt-12">
          <Suspense fallback={<div className="min-h-96" />}>
            <ProgrammeCards programmes={programmes} hideArchived />
          </Suspense>
        </div>
      </HomeSection>
    </TopicPage>
  );
}
