import { Check } from "lucide-react";
import type { Block } from "@/content/pages";

/*
  A grid of short title + description blocks (benefits, challenges, curriculum weeks,
  application phases). `numbered` shows 01, 02… instead of a tick, for ordered lists.
*/

type FeatureGridProps = {
  items: Block[];
  numbered?: boolean;
  numberLabel?: string; // e.g. "Week" gives "Week 1"
  columns?: 2 | 3 | 4;
  tone?: "white" | "green";
};

const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export function FeatureGrid({ items, numbered = false, numberLabel, columns = 3, tone = "white" }: FeatureGridProps) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className={`grid gap-6 ${cols[columns]}`}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`rounded-card p-6 ${tone === "white" ? "border border-gray-200 bg-white" : "bg-green-50"}`}
        >
          {numbered ? (
            <p className="text-eyebrow uppercase text-green-700">
              {numberLabel ? `${numberLabel} ${i + 1}` : String(i + 1).padStart(2, "0")}
            </p>
          ) : (
            <span className="inline-flex size-9 items-center justify-center rounded-control bg-green-50">
              <Check aria-hidden className="size-5 text-green-700" />
            </span>
          )}
          <h3 className="mt-3 text-h3 text-navy-900">{item.title}</h3>
          <p className="mt-2 text-gray-700">{item.description}</p>
        </li>
      ))}
    </List>
  );
}
