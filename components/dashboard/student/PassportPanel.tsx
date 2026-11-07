import Link from "next/link";
import { ArrowUpRight, Award, BookOpen, CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Panel } from "@/components/dashboard/parts";
import { studentText } from "@/content/dashboard";
import { certificates, courses, passport, skills } from "@/data/student";

/*
  Skills Passport panel from Aston's design: gradient passport card (deep green to green-700,
  so white text passes contrast), rank chip (amber, navy text), verified-skill count,
  name and ID, then three small stats.
*/

const t = studentText.passport;

export function PassportCard({ name }: { name: string }) {
  const verified = skills.filter((s) => s.verified).length;
  return (
    <div className="rounded-panel bg-linear-to-br from-green-deep to-green-700 p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <p className="text-eyebrow uppercase">{t.cardLabel}</p>
        <span title={t.rankSample} className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 font-semibold text-navy-900">
          <Award aria-hidden className="size-4" />
          {t.rank.replace("{n}", String(passport.rank))}
          <span className="sr-only"> ({t.rankSample})</span>
        </span>
      </div>
      <p className="mt-5">{t.verifiedSoFar}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-display-mobile">{verified}</span>
        <span className="text-h3">{t.skillsUnit}</span>
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">{name}</p>
        <p className="text-sm">
          {t.id} {passport.id}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof Award; value: ReactNode; label: string }) {
  return (
    <div className="rounded-tile bg-gray-50 p-4">
      <Icon aria-hidden className="size-5 text-green-700" />
      <p className="mt-2 text-h3 text-navy-900">{value}</p>
      <p className="text-sm text-gray-700">{label}</p>
    </div>
  );
}

export function PassportPanel({ name, href, completedLessons }: { name: string; href: string; completedLessons: ReactNode }) {
  return (
    <Panel
      title={t.title}
      subtitle={t.subtitle}
      id="passport-title"
      action={
        <Link
          href={href}
          aria-label={t.open}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-navy-900 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        >
          <ArrowUpRight aria-hidden className="size-5" />
        </Link>
      }
    >
      <PassportCard name={name} />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniStat icon={BookOpen} value={courses.length} label={t.stats.enrolled} />
        <MiniStat icon={CircleCheck} value={completedLessons} label={t.stats.completed} />
        <MiniStat icon={Award} value={certificates.length} label={t.stats.certificates} />
      </div>
    </Panel>
  );
}
