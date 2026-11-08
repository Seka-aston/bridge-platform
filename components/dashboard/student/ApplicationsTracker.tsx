"use client";

import { Check, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/dashboard/parts";
import { OPP_STORE } from "@/components/dashboard/student/OpportunitiesTable";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { companyText, studentText } from "@/content/dashboard";
import type { Stage } from "@/data/company";
import { readJSON, readSession } from "@/lib/prototypeStore";
import { cn } from "@/lib/utils";

/*
  Application tracking. Combines programme applications made on the public website and
  opportunity applications made in the dashboard, all from this browser tab. The company
  dashboard can move the student's internship application along (Checkpoint 11).
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

  if (items === null) return <Skeleton className="h-28 w-full" />;
  if (items.length === 0) {
    return <EmptyState icon={Send} title={t.applicationsEmpty.title} body={t.applicationsEmpty.body} action={{ label: t.applicationsEmpty.action, href: "/programmes" }} />;
  }
  return (
    <ul className="divide-y rounded-lg border">
      {items.map((a) => {
        const step = stepOf(a.stage);
        return (
          <li key={a.key} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-heading">{a.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{t.kind[a.kind]}</Badge>
                {t.appliedOn.replace(
                  "{date}",
                  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(a.savedAt)),
                )}
              </div>
            </div>
            <ol className="mt-4 grid grid-cols-3 gap-2" aria-label={t.currentStep.replace("{step}", t.steps[step])}>
              {t.steps.map((label, i) => {
                const reached = i <= step;
                return (
                  <li key={label} className="flex flex-col gap-2">
                    <span className={cn("h-1.5 rounded-full", reached ? "bg-primary" : "bg-border")} aria-hidden />
                    <span className={cn("flex items-center gap-1.5 text-xs", reached ? "font-medium text-heading" : "text-muted-foreground")}>
                      {reached && <Check aria-hidden className="size-3.5 text-primary" />}
                      {label}
                      {i === step && a.stage && a.stage !== "new" && ` · ${companyText.applicantsPage.stages[a.stage]}`}
                    </span>
                  </li>
                );
              })}
            </ol>
          </li>
        );
      })}
    </ul>
  );
}
