"use client";

import { useState } from "react";
import { CourseCard, coursePercent } from "@/components/dashboard/student/CourseCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { studentText } from "@/content/dashboard";
import type { Course } from "@/data/student";

// All courses with an Active / Completed / All filter. Each card opens its course page.
type Filter = "active" | "completed" | "all";

export function CoursesBrowser({ items }: { items: Course[] }) {
  const t = studentText.courses;
  const [filter, setFilter] = useState<Filter>("active");
  const match = (f: Filter) => (c: Course) => (f === "all" ? true : f === "completed" ? coursePercent(c) === 100 : coursePercent(c) < 100);
  return (
    <div className="space-y-6">
      <ToggleGroup type="single" variant="outline" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label={t.title} className="flex-wrap">
        {(["active", "completed", "all"] as Filter[]).map((f) => (
          <ToggleGroupItem key={f} value={f} className="px-3">
            {t.filter[f]} <span className="text-muted-foreground tabular-nums">{items.filter(match(f)).length}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.filter(match(filter)).map((c) => (
          <li key={c.id}>
            <CourseCard course={c} href={`/dashboard/student/courses/${c.id}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
