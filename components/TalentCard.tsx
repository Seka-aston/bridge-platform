import { BadgeCheck, Clock } from "lucide-react";
import { AvailabilityRow } from "@/components/AvailabilityRow";
import { Badge } from "@/components/Badge";
import { talentCardText as t } from "@/content/ui";
import type { TalentProfile } from "@/data/talent";

/*
  Talent profile card (CLAUDE.md section 7, component 9; spec 4.2.8).
  Always labelled "Sample profile". No photos (initials only) and no match percentages.
  Availability appears only when the learner has consented to share it.
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
    <article className="flex h-full flex-col rounded-card border border-gray-200 bg-white p-6 shadow-card">
      <Badge kind="sampleProfile" className="self-start" />
      <div className="mt-4 flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-green-50 font-bold text-green-700"
        >
          {initials(p.name)}
        </span>
        <div>
          <h3 className="text-h3 text-navy-900">{p.name}</h3>
          <p className="text-gray-700">{p.discipline}</p>
        </div>
      </div>

      <p className={`mt-4 inline-flex items-center gap-2 font-semibold ${verified ? "text-green-700" : "text-gray-700"}`}>
        {verified ? <BadgeCheck aria-hidden className="size-5" /> : <Clock aria-hidden className="size-5" />}
        {verified ? t.verified : t.inProgress}
      </p>
      <p className="text-gray-500">{p.level}</p>

      <div className="mt-5 space-y-4 border-t border-gray-200 pt-5">
        <div>
          <h4 className="font-semibold text-navy-900">{t.skills}</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <li key={s} className="rounded-control border border-gray-200 px-2 py-0.5 text-gray-800">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-navy-900">{t.evidence}</h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-700">
            {p.projectEvidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-navy-900">{t.experience}</h4>
          <p className="mt-1 text-gray-700">{p.experience}</p>
        </div>
        <AvailabilityRow profileId={p.id} consented={!!p.availability?.consented} text={p.availability?.text ?? ""} label={t.availability} />
        <div>
          <h4 className="font-semibold text-navy-900">{t.suitableFor}</h4>
          <p className="mt-1 text-gray-700">{p.suitableFor.join(" · ")}</p>
        </div>
      </div>
    </article>
  );
}
