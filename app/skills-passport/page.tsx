import type { Metadata } from "next";
import { HomeSection } from "@/components/HomeSection";
import { SectionHeading } from "@/components/SectionHeading";
import { TalentCard } from "@/components/TalentCard";
import { TopicPage } from "@/components/TopicPage";
import { skillsPassportPage as c } from "@/content/pages";
import { talentProfiles } from "@/data/talent";

export const metadata: Metadata = { title: "Skills Passport", description: c.card.description };

export default function SkillsPassportPage() {
  return (
    <TopicPage
      eyebrow={c.eyebrow}
      title={c.card.title}
      description={c.card.description}
      capabilities={c.card.capabilities}
      actions={[c.talent.primary]}
    >
      <HomeSection id="talent" labelledBy="talent-title">
        <SectionHeading id="talent-title" eyebrow={c.talent.eyebrow} title={c.talent.headline} supporting={c.talent.supporting} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {talentProfiles.slice(0, 3).map((p) => (
            <li key={p.id}>
              <TalentCard profile={p} />
            </li>
          ))}
        </ul>
      </HomeSection>
    </TopicPage>
  );
}
