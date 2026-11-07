import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FinalBand } from "@/components/FinalBand";
import { HomeSection } from "@/components/HomeSection";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { TalentCard } from "@/components/TalentCard";
import { forCompanies as c } from "@/content/pages";
import { talentProfiles } from "@/data/talent";

export const metadata: Metadata = { title: "For Companies", description: c.header.body };

export default function ForCompaniesPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        eyebrow={c.header.audience}
        title={c.header.headline}
        supporting={c.header.body}
        actions={
          <>
            <Button href={c.primary.href} size="lg">{c.primary.label}</Button>
            <Button href={c.talent.secondary.href} size="lg" variant="outline">{c.talent.secondary.label}</Button>
          </>
        }
      />

      <HomeSection id="talent" labelledBy="talent-title">
        <SectionHeading id="talent-title" eyebrow={c.talent.eyebrow} title={c.talent.headline} supporting={c.talent.supporting} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {talentProfiles.map((p) => (
            <li key={p.id}>
              <TalentCard profile={p} />
            </li>
          ))}
        </ul>
      </HomeSection>

      <HomeSection id="benefits" labelledBy="benefits-title" tone="green">
        <SectionHeading id="benefits-title" eyebrow={c.benefits.eyebrow} title={c.benefits.title} supporting={c.benefits.supporting} />
        <div className="mt-12">
          <FeatureGrid items={c.benefits.items} />
        </div>
      </HomeSection>

      <FinalBand primary={c.primary} />
    </main>
  );
}
