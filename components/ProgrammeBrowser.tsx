"use client";

import { useState, type ReactNode } from "react";
import type { ProgrammeStatus } from "@/lib/programmes";

/*
  Programme list filter (Checkpoint 5). Cards are built on the server (where each status
  is calculated for today) and passed in ready-made; this component only shows or hides them.
  "Current" = open, upcoming and closed; archived programmes are a separate choice.
*/

type Filter = "current" | ProgrammeStatus;
const order: Filter[] = ["current", "open", "upcoming", "closed", "archived"];

type Item = { id: string; status: ProgrammeStatus; card: ReactNode };

type Labels = {
  label: string;
  options: Record<Filter, string>;
  count: string;
  countOne: string;
  empty: string;
};

function matches(filter: Filter, status: ProgrammeStatus) {
  return filter === "current" ? status !== "archived" : status === filter;
}

export function ProgrammeBrowser({ items, labels }: { items: Item[]; labels: Labels }) {
  const [filter, setFilter] = useState<Filter>("current");
  const shown = items.filter((i) => matches(filter, i.status));
  const countText = shown.length === 1 ? labels.countOne : labels.count.replace("{n}", String(shown.length));

  return (
    <div>
      <div role="group" aria-label={labels.label} className="flex flex-wrap items-center gap-2">
        <span className="mr-2 font-semibold text-navy-900">{labels.label}</span>
        {order.map((f) => {
          const n = items.filter((i) => matches(f, i.status)).length;
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
                active ? "border-green-700 bg-green-700 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:text-green-700"
              }`}
            >
              {labels.options[f]} <span className={active ? "text-white" : "text-gray-500"}>({n})</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-4 text-gray-700">
        {countText}
      </p>
      {shown.length === 0 ? (
        <p className="mt-6 rounded-card border border-dashed border-gray-500 p-6 text-gray-700">{labels.empty}</p>
      ) : (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((i) => (
            <li key={i.id}>{i.card}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
