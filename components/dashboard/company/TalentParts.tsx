"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Info, Star } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { TalentCard } from "@/components/TalentCard";
import { useCompanyData } from "@/components/dashboard/company/CompanyData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { companyText, noticeText } from "@/content/dashboard";
import { talentCardText } from "@/content/ui";
import { company } from "@/data/company";
import type { TalentProfile } from "@/data/talent";
import { addNotice } from "@/lib/prototypeStore";

/*
  Talent tile (redesign Step 7): a card with initials, name, discipline, verification label,
  top skills and "View profile". The profile drawer body is built from the learner's Skills
  Passport (public, authorised fields only).
*/

export function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

export function TalentTile({ profile: p, onOpen }: { profile: TalentProfile; onOpen: () => void }) {
  const { shortlist } = useCompanyData();
  const saved = shortlist.includes(p.id);
  const verified = p.verification === "verified";
  return (
    <article className="flex h-full flex-col gap-4 rounded-xl bg-card p-4 text-sm shadow-xs ring-1 ring-border">
      <div className="flex items-start justify-between gap-3">
        <Avatar className="size-11">
          <AvatarFallback className="bg-brand-navy font-semibold text-white">{initials(p.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-wrap justify-end gap-1.5">
          {saved && (
            <Badge className="bg-brand-amber text-brand-navy" title={companyText.profile.shortlisted}>
              <Star data-icon="inline-start" aria-hidden fill="currentColor" />
              <span className="sr-only">{companyText.profile.shortlisted}</span>
            </Badge>
          )}
          <Badge variant={verified ? "verified" : "outline"} className={verified ? undefined : "text-muted-foreground"}>
            {verified ? <BadgeCheck data-icon="inline-start" aria-hidden /> : <Clock data-icon="inline-start" aria-hidden />}
            {verified ? talentCardText.verified : talentCardText.inProgress}
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="font-heading text-base leading-snug font-semibold text-heading">{p.name}</h3>
        <p className="mt-0.5 text-muted-foreground">{p.discipline}</p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {p.skills.slice(0, 3).map((s) => (
          <li key={s}>
            <Badge variant="outline">{s}</Badge>
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" onClick={onOpen} className="mt-auto w-full">
        {companyText.recommended.viewProfile}
        <span className="sr-only">: {p.name}</span>
      </Button>
    </article>
  );
}

export function ProfileDrawerBody({ profile }: { profile: TalentProfile }) {
  const { shortlist, toggleShortlist } = useCompanyData();
  const saved = shortlist.includes(profile.id);
  const t = companyText.profile;
  // Connected journey: the sample student sees that this company viewed her Skills Passport.
  useEffect(() => {
    if (profile.id === "sample-1") addNotice("student", noticeText.profileViewed.replace("{company}", company.name));
  }, [profile.id]);
  return (
    <div className="space-y-5">
      <Alert>
        <Info aria-hidden />
        <AlertDescription>{t.note}</AlertDescription>
      </Alert>
      <TalentCard profile={profile} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant={saved ? "outline" : "default"}
          onClick={() => {
            if (!saved && profile.id === "sample-1") addNotice("student", noticeText.shortlisted.replace("{company}", company.name));
            toggleShortlist(profile.id);
            toast.success(saved ? t.removed : t.shortlisted);
          }}
        >
          <Star data-icon="inline-start" aria-hidden fill={saved ? "currentColor" : "none"} />
          {saved ? t.remove : t.shortlist}
        </Button>
        {profile.id === "sample-1" && (
          <Button asChild variant="ghost">
            <Link href="/passport/BR-2026-0417">{t.publicPassport}</Link>
          </Button>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {saved ? t.shortlisted : ""}
      </p>
    </div>
  );
}
