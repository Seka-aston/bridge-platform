"use client";

import { useState } from "react";
import { CourseCard, coursePercent } from "@/components/dashboard/student/CourseCard";
import { studentText } from "@/content/dashboard";
import type { Course } from "@/data/student";

// All courses with an Active / Completed / All filter. Each card opens its course page.
type Filter = "active" | "completed" | "all";

export function CoursesBrowser({ items }: { items: Course[] }) {
  const t = studentText.courses;
  const [filter, setFilter] = useState<Filter>("active");
  const match = (c: Course) => (filter === "all" ? true : filter === "completed" ? coursePercent(c) === 100 : coursePercent(c) < 100);
  return (
    <div>
      <div role="group" aria-label={t.title} className="flex flex-wrap gap-2">
        {(["active", "completed", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
              filter === f ? "bg-green-700 text-white" : "bg-white text-navy-900 hover:bg-green-50"
            }`}
          >
            {t.filter[f]}
          </button>
        ))}
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.filter(match).map((c) => (
          <li key={c.id}>
            <CourseCard course={c} href={`/dashboard/student/courses/${c.id}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
