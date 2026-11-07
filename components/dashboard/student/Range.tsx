"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { studentText } from "@/content/dashboard";
import { lessonLog } from "@/data/student";

/*
  Date-range selector from Aston's design. Preset periods (sample data); choosing one
  updates the "Completed lessons" figure on the Skills Passport panel.
*/

type RangeKey = "week" | "month" | "term";
const days: Record<RangeKey, number> = { week: 7, month: 30, term: 90 };
const Ctx = createContext<{ range: RangeKey; setRange: (r: RangeKey) => void }>({ range: "term", setRange: () => {} });

export function RangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<RangeKey>("term");
  return <Ctx.Provider value={{ range, setRange }}>{children}</Ctx.Provider>;
}

export function RangeSelect() {
  const { range, setRange } = useContext(Ctx);
  const t = studentText.range;
  return (
    <label className="relative inline-flex items-center rounded-full bg-white shadow-soft">
      <span className="sr-only">{t.label}</span>
      <CalendarDays aria-hidden className="pointer-events-none absolute left-4 size-5 text-navy-900" />
      <select
        value={range}
        onChange={(e) => setRange(e.target.value as RangeKey)}
        className="appearance-none rounded-full bg-transparent py-3 pl-12 pr-11 font-semibold text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
      >
        {(Object.keys(t.options) as RangeKey[]).map((k) => (
          <option key={k} value={k}>
            {t.options[k]}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-4 size-5 text-navy-900" />
    </label>
  );
}

export function CompletedLessons() {
  const { range } = useContext(Ctx);
  return <>{lessonLog.filter((d) => d < days[range]).length}</>;
}
