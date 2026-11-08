import type { Metadata } from "next";
import { Award, BadgeCheck, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { PassportGate } from "@/components/PassportGate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Display, Eyebrow, Lead, SectionTitle } from "@/components/ui/typography";
import { studentText } from "@/content/dashboard";
import { certificates, passport, projects, skills } from "@/data/student";
import { talentProfiles } from "@/data/talent";
import { sampleUsers } from "@/data/users";

/*
  Public, shareable Skills Passport (Checkpoint 7). Shows only what is safe to share:
  verified skills, project evidence and certificates. Never contact details.
  Illustrative sample profile; hidden from search engines.
*/

const t = studentText.publicPassport;
const p = studentText.passportPage;

export function generateStaticParams() {
  return [{ id: passport.id }];
}

export const metadata: Metadata = { title: "Skills Passport (sample)", robots: { index: false } };

export default async function PublicPassportPage({ params }: PageProps<"/passport/[id]">) {
  const { id } = await params;
  if (id !== passport.id) notFound();
  const user = sampleUsers.student;
  const profile = talentProfiles.find((x) => x.id === user.talentId)!;
  const verified = skills.filter((s) => s.verified);

  return (
    <main id="main" className="flex-1 bg-section-tint">
      <PassportGate>
        <div className="mx-auto max-w-4xl space-y-6 px-gutter py-section-mobile md:py-section">
          <div className="surface-navy rounded-xl p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <Badge kind="sampleProfile" />
            </div>
            <Display className="mt-6">{user.name}</Display>
            <Lead className="mt-2">
              {profile.discipline} · {profile.level}
            </Lead>
            <p className="mt-6 flex flex-wrap items-center gap-2 font-medium">
              <BadgeCheck aria-hidden className="size-5 text-brand-green" />
              <span className="tabular-nums">
                {verified.length} {studentText.passport.skillsUnit}
              </span>
              <span aria-hidden className="text-muted-foreground">
                ·
              </span>
              <span className="text-muted-foreground">
                {studentText.passport.id} {passport.id}
              </span>
            </p>
          </div>

          <Alert>
            <Info />
            <AlertDescription>{t.note}</AlertDescription>
          </Alert>

          <Card className="text-base">
            <CardHeader>
              <SectionTitle id="pp-skills">{p.skillsTitle}</SectionTitle>
            </CardHeader>
            <CardContent>
              <ul aria-labelledby="pp-skills" className="flex flex-wrap gap-2">
                {verified.map((s) => (
                  <li key={s.name}>
                    <UiBadge variant="verified" className="h-7 px-3 text-sm">
                      <BadgeCheck data-icon="inline-start" aria-hidden /> {s.name}
                    </UiBadge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="text-base">
            <CardHeader>
              <SectionTitle id="pp-projects">{p.projectsTitle}</SectionTitle>
            </CardHeader>
            <CardContent>
              <ul aria-labelledby="pp-projects" className="grid gap-4 md:grid-cols-2">
                {projects.map((pr) => (
                  <li key={pr.id} className="rounded-lg border p-5">
                    <p className="font-semibold text-heading">{pr.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{pr.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="text-base">
            <CardHeader>
              <SectionTitle id="pp-certs">{p.certificatesTitle}</SectionTitle>
            </CardHeader>
            <CardContent>
              <ul aria-labelledby="pp-certs" className="space-y-4">
                {certificates.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <Award aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-semibold text-heading">{c.title}</span>
                      <span className="block text-sm text-muted-foreground">{p.issued.replace("{issuer}", c.issuer).replace("{year}", String(c.year))}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </PassportGate>
    </main>
  );
}
