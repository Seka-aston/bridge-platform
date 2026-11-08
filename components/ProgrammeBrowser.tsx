"use client";

import { SearchX } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ProgrammeStatus } from "@/lib/programmes";

/*
  Programme list filter. Cards are built on the server (where each status is calculated for
  today) and passed in ready-made; this component only shows or hides them.
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
      <div className="flex flex-wrap items-center gap-3">
        <span id="programme-filter-label" className="text-sm font-semibold text-heading">
          {labels.label}
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          value={filter}
          onValueChange={(v) => v && setFilter(v as Filter)}
          aria-labelledby="programme-filter-label"
          className="flex-wrap"
        >
          {order.map((f) => {
            const n = items.filter((i) => matches(f, i.status)).length;
            return (
              <ToggleGroupItem key={f} value={f} className="px-3">
                {labels.options[f]} <span className="text-muted-foreground tabular-nums">{n}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
      <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
        {countText}
      </p>
      {shown.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyDescription>{labels.empty}</EmptyDescription>
          </EmptyHeader>
        </Empty>
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
