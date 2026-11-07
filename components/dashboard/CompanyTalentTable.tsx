"use client";

import { BadgeCheck, Clock, SearchX } from "lucide-react";
import { useState } from "react";
import { TalentCard } from "@/components/TalentCard";
import { DataTable, EmptyState } from "@/components/dashboard/parts";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { dashboardText as d, overviewText } from "@/content/dashboard";
import { talentCardText } from "@/content/ui";
import type { TalentProfile } from "@/data/talent";

/*
  Talent table with search, a discipline filter and a detail drawer (Checkpoint 6 demo of
  filters, tables and drawers). Uses the shared sample profiles; only public, consented
  fields are shown (availability appears only where the learner consented).
*/

const t = overviewText.company;

export function CompanyTalentTable({ profiles }: { profiles: TalentProfile[] }) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const disciplines = [...new Set(profiles.map((p) => p.discipline))];
  const q = query.trim().toLowerCase();
  const shown = profiles.filter(
    (p) =>
      (!discipline || p.discipline === discipline) &&
      (!q || p.name.toLowerCase().includes(q) || p.skills.some((s) => s.toLowerCase().includes(q))),
  );
  const open = profiles.find((p) => p.id === openId);

  const field =
    "mt-1 block w-full rounded-control border border-gray-500 bg-white px-3 py-2 text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="block font-semibold text-navy-900">
          {d.search}
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPlaceholder} className={field} />
        </label>
        <label className="block font-semibold text-navy-900">
          {t.filterLabel}
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className={field}>
            <option value="">{d.allOption}</option>
            {disciplines.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <p aria-live="polite" className="mt-4 text-gray-700">
        {d.showing.replace("{n}", String(shown.length)).replace("{total}", String(profiles.length))}
      </p>

      <div className="mt-4">
        {shown.length === 0 ? (
          <EmptyState icon={SearchX} title={d.noResults.title} body={d.noResults.body} />
        ) : (
          <DataTable
            caption={t.tableTitle}
            columns={[
              { key: "name", header: t.columns.name },
              { key: "discipline", header: t.columns.discipline },
              { key: "verification", header: t.columns.verification },
              { key: "availability", header: t.columns.availability },
              { key: "action", header: "", className: "text-right" },
            ]}
            rows={shown.map((p) => ({
              key: p.id,
              cells: {
                name: p.name,
                discipline: p.discipline,
                verification:
                  p.verification === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
                      <BadgeCheck aria-hidden className="size-4" /> {talentCardText.verified}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-gray-700">
                      <Clock aria-hidden className="size-4" /> {talentCardText.inProgress}
                    </span>
                  ),
                availability: p.availability?.consented ? p.availability.text : <span className="text-gray-500">{t.notShared}</span>,
                action: (
                  <button
                    type="button"
                    onClick={() => setOpenId(p.id)}
                    className="rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                  >
                    {d.viewDetails}
                    <span className="sr-only">: {p.name}</span>
                  </button>
                ),
              },
            }))}
          />
        )}
      </div>

      <DetailDrawer open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? ""}>
        {open && <TalentCard profile={open} />}
      </DetailDrawer>
    </div>
  );
}
