"use client";

import { Check, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/dashboard/parts";
import { studentText } from "@/content/dashboard";
import { readJSON, readSession } from "@/lib/prototypeStore";
import { companyText } from "@/content/dashboard";
import type { Stage } from "@/data/company";
import { OPP_STORE } from "@/components/dashboard/student/OpportunitiesTable";

/*
  Application tracking (Checkpoint 7). Combines programme applications made on the public
  website and opportunity applications made in the dashboard, all from this browser tab.
  In the prototype every application sits at the first step, "Submitted".
*/

const t = studentText.opportunitiesPage;
type Item = { key: string; title: string; kind: "programme" | "opportunity"; savedAt: string; stage?: Stage };
// Where a company stage sits on the student's three-step tracker.
const stepOf = (s?: Stage) => (!s || s === "new" ? 0 : s === "reviewing" || s === "interview" ? 1 : 2);

export function ApplicationsTracker() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    const programmes = readSession<{ programmeId: string; programmeName: string; savedAt: string }>("bridge-applications").map((a) => ({
      key: `p-${a.programmeId}-${a.savedAt}`,
      title: a.programmeName,
      kind: "programme" as const,
      savedAt: a.savedAt,
    }));
    // The company dashboard's stage for the student's application to its internship (Checkpoint 11).
    const companyStage = readJSON<Record<string, Stage>>("bridge-stage-overrides", {})["session-diane"];
    const opps = readSession<{ id: string; position: string; company: string; savedAt: string }>(OPP_STORE).map((a) => ({
      stage: a.id === "o1" ? companyStage : undefined,
      key: `o-${a.id}-${a.savedAt}`,
      title: `${a.position} · ${a.company}`,
      kind: "opportunity" as const,
      savedAt: a.savedAt,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setItems([...programmes, ...opps].sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
  }, []);

  if (items === null) return <div className="min-h-32" />;
  if (items.length === 0) {
    return <EmptyState icon={Send} title={t.applicationsEmpty.title} body={t.applicationsEmpty.body} action={{ label: t.applicationsEmpty.action, href: "/programmes" }} />;
  }
  return (
    <ul className="space-y-4">
      {items.map((a) => (
        <li key={a.key} className="rounded-tile border border-gray-200 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-bold text-navy-900">{a.title}</p>
            <p className="text-sm text-gray-700">
              {t.kind[a.kind]} ·{" "}
              {t.appliedOn.replace(
                "{date}",
                new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(a.savedAt)),
              )}
            </p>
          </div>
          <ol className="mt-4 grid grid-cols-3 gap-2" aria-label={t.currentStep.replace("{step}", t.steps[stepOf(a.stage)])}>
            {t.steps.map((step, i) => {
              const reached = i <= stepOf(a.stage);
              return (
                <li key={step} className="flex flex-col gap-2">
                  <span className={`h-1.5 rounded-full ${reached ? "bg-green-700" : "bg-gray-200"}`} aria-hidden />
                  <span className={`flex items-center gap-1.5 text-sm ${reached ? "font-semibold text-navy-900" : "text-gray-700"}`}>
                    {reached && <Check aria-hidden className="size-4 text-green-700" />}
                    {step}
                    {i === stepOf(a.stage) && a.stage && a.stage !== "new" && ` · ${companyText.applicantsPage.stages[a.stage]}`}
                  </span>
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ul>
  );
}
