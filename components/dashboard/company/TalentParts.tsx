"use client";

import { BadgeCheck, Clock, Star } from "lucide-react";
import { Button } from "@/components/Button";
import { TalentCard } from "@/components/TalentCard";
import { useCompanyData } from "@/components/dashboard/company/CompanyData";
import { companyText } from "@/content/dashboard";
import { talentCardText } from "@/content/ui";
import type { TalentProfile } from "@/data/talent";

/*
  Talent tile (same visual language as the student's course cards: coloured tile, title,
  detail, chips) and the profile drawer body built from the learner's Skills Passport.
*/

// Tile colour and the colour of the large initials on it. White on amber is too low in
// contrast (2.8:1), so amber tiles use navy initials (3.9:1, passes for large text).
const tones = [
  { bg: "bg-navy-900", text: "text-white" },
  { bg: "bg-green-deep", text: "text-white" },
  { bg: "bg-amber-600", text: "text-navy-900" },
  { bg: "bg-green-700", text: "text-white" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

export function TalentTile({ profile: p, index, onOpen }: { profile: TalentProfile; index: number; onOpen: () => void }) {
  const { shortlist } = useCompanyData();
  const saved = shortlist.includes(p.id);
  return (
    <article className="flex h-full flex-col rounded-panel border border-gray-200 bg-white p-3">
      <div className={`relative flex h-32 items-center justify-center rounded-tile ${tones[index % tones.length].bg}`}>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy-900/40 px-2.5 py-0.5 text-sm font-semibold text-white">
          {p.verification === "verified" ? <BadgeCheck aria-hidden className="size-3.5" /> : <Clock aria-hidden className="size-3.5" />}
          {p.verification === "verified" ? talentCardText.verified : talentCardText.inProgress}
        </span>
        {saved && (
          <span className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-full bg-amber-500 text-navy-900" title={companyText.profile.shortlisted}>
            <Star aria-hidden className="size-4" fill="currentColor" />
            <span className="sr-only">{companyText.profile.shortlisted}</span>
          </span>
        )}
        <span aria-hidden className={`text-display-mobile ${tones[index % tones.length].text}`}>
          {initials(p.name)}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="text-h3 text-navy-900">{p.name}</h3>
        <p className="mt-1 text-gray-700">{p.discipline}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.skills.slice(0, 3).map((s) => (
            <li key={s} className="rounded-full bg-gray-50 px-2.5 py-1 text-sm font-semibold text-navy-900">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          <Button variant="outline" shape="pill" onClick={onOpen} className="w-full">
            {companyText.recommended.viewProfile}
            <span className="sr-only">: {p.name}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProfileDrawerBody({ profile }: { profile: TalentProfile }) {
  const { shortlist, toggleShortlist } = useCompanyData();
  const saved = shortlist.includes(profile.id);
  const t = companyText.profile;
  return (
    <div className="space-y-5">
      <p className="rounded-tile bg-gray-50 p-3 text-sm text-gray-700">{t.note}</p>
      <TalentCard profile={profile} />
      <div className="flex flex-wrap gap-3">
        <Button shape="pill" variant={saved ? "outline" : "primary"} onClick={() => toggleShortlist(profile.id)}>
          <Star aria-hidden className="size-4" fill={saved ? "currentColor" : "none"} />
          {saved ? t.remove : t.shortlist}
        </Button>
        {profile.id === "sample-1" && (
          <Button href="/passport/BR-2026-0417" variant="text">
            {t.publicPassport}
          </Button>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {saved ? t.shortlisted : ""}
      </p>
    </div>
  );
}
