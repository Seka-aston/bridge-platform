import type { Metadata } from "next";
import { Award, BadgeCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
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
    <main id="main" className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-4xl px-gutter py-section-mobile md:py-section">
        <div className="rounded-panel bg-linear-to-br from-green-deep to-green-700 p-6 text-white md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-eyebrow uppercase">{t.eyebrow}</p>
            <Badge kind="sampleProfile" />
          </div>
          <h1 className="mt-6 text-display-mobile md:text-display">{user.name}</h1>
          <p className="mt-2 text-body-lg">
            {profile.discipline} · {profile.level}
          </p>
          <p className="mt-6 flex items-center gap-2 font-semibold">
            <BadgeCheck aria-hidden className="size-5" /> {verified.length} {studentText.passport.skillsUnit} · {studentText.passport.id} {passport.id}
          </p>
        </div>

        <p className="mt-6 rounded-tile border border-dashed border-gray-500 bg-white p-4 text-gray-700">{t.note}</p>

        <section aria-labelledby="pp-skills" className="mt-6 rounded-panel bg-white p-6 md:p-8">
          <h2 id="pp-skills" className="text-h3 text-navy-900 md:text-panel">{p.skillsTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {verified.map((s) => (
              <li key={s.name} className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 font-semibold text-navy-900">
                <BadgeCheck aria-hidden className="size-4 text-green-700" /> {s.name}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pp-projects" className="mt-6 rounded-panel bg-white p-6 md:p-8">
          <h2 id="pp-projects" className="text-h3 text-navy-900 md:text-panel">{p.projectsTitle}</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((pr) => (
              <li key={pr.id} className="rounded-tile border border-gray-200 p-5">
                <p className="font-bold text-navy-900">{pr.title}</p>
                <p className="mt-1 text-gray-700">{pr.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pp-certs" className="mt-6 rounded-panel bg-white p-6 md:p-8">
          <h2 id="pp-certs" className="text-h3 text-navy-900 md:text-panel">{p.certificatesTitle}</h2>
          <ul className="mt-4 space-y-3">
            {certificates.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <Award aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" />
                <span>
                  <span className="block font-semibold text-navy-900">{c.title}</span>
                  <span className="block text-sm text-gray-700">{p.issued.replace("{issuer}", c.issuer).replace("{year}", String(c.year))}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
