"use client";

import { CalendarDays } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { studentText } from "@/content/dashboard";
import { lessonLog } from "@/data/student";

/*
  Date-range selector. Preset periods (sample data); choosing one updates the
  "Completed lessons" figure on the Skills Passport panel.
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
    <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
      <SelectTrigger aria-label={t.label} className="h-9! bg-background">
        <CalendarDays aria-hidden className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {(Object.keys(t.options) as RangeKey[]).map((k) => (
          <SelectItem key={k} value={k}>
            {t.options[k]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CompletedLessons() {
  const { range } = useContext(Ctx);
  return <>{lessonLog.filter((d) => d < days[range]).length}</>;
}
