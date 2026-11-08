import { BadgeCheck, Clock } from "lucide-react";
import { AvailabilityRow } from "@/components/AvailabilityRow";
import { Badge } from "@/components/Badge";
import { TalentField } from "@/components/TalentField";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { H3 } from "@/components/ui/typography";
import { talentCardText as t } from "@/content/ui";
import type { TalentProfile } from "@/data/talent";

/*
  Talent profile card (spec 4.2.8). Always labelled "Sample profile". No photos (initials only)
  and no match percentages. Availability appears only when the learner has consented to share it.
*/

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function TalentCard({ profile: p }: { profile: TalentProfile }) {
  const verified = p.verification === "verified";
  return (
    <Card className="h-full gap-5 text-base">
      <CardHeader className="gap-4">
        <Badge kind="sampleProfile" />
        <div className="flex items-center gap-3">
          <Avatar size="lg" aria-hidden>
            <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">{initials(p.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <H3>{p.name}</H3>
            <p className="text-sm text-muted-foreground">{p.discipline}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {verified ? (
            <UiBadge variant="verified">
              <BadgeCheck data-icon="inline-start" aria-hidden /> {t.verified}
            </UiBadge>
          ) : (
            <UiBadge variant="outline">
              <Clock data-icon="inline-start" aria-hidden /> {t.inProgress}
            </UiBadge>
          )}
          <span className="text-sm text-muted-foreground">{p.level}</span>
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <Separator />
        <TalentField label={t.skills}>
          <ul className="flex flex-wrap gap-1.5">
            {p.skills.map((s) => (
              <li key={s}>
                <UiBadge variant="outline">{s}</UiBadge>
              </li>
            ))}
          </ul>
        </TalentField>
        <TalentField label={t.evidence}>
          <ul className="list-disc space-y-1 pl-4 marker:text-muted-foreground">
            {p.projectEvidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </TalentField>
        <TalentField label={t.experience}>
          <p>{p.experience}</p>
        </TalentField>
        <AvailabilityRow profileId={p.id} consented={!!p.availability?.consented} text={p.availability?.text ?? ""} label={t.availability} />
        <TalentField label={t.suitableFor}>
          <p>{p.suitableFor.join(" · ")}</p>
        </TalentField>
      </CardContent>
    </Card>
  );
}
