"use client";

import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Panel } from "@/components/dashboard/parts";
import { sharedText } from "@/content/dashboard";

/*
  Shared dashboard pieces in the student dashboard's visual language (Aston's design):
  coloured tile cards, a gradient summary panel with mini stats, a round arrow link, and the
  tabbed "what's next today?" panel. Used by the School and Admin dashboards.
*/

export const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

export function ago(n: number) {
  return sharedText.agoDays[String(n)] ?? sharedText.agoDays.n.replace("{n}", String(n));
}

// Tile colours. White text fails on amber, so amber tiles use navy text (3.9:1, large text).
const tones = [
  { bg: "bg-navy-900", text: "text-white" },
  { bg: "bg-green-deep", text: "text-white" },
  { bg: "bg-amber-600", text: "text-navy-900" },
  { bg: "bg-green-700", text: "text-white" },
];

export function ColorTile({
  index,
  big,
  chip,
  title,
  detail,
  children,
}: {
  index: number;
  big: ReactNode;
  chip?: ReactNode;
  title: string;
  detail?: ReactNode;
  children?: ReactNode;
}) {
  const tone = tones[index % tones.length];
  return (
    <article className="flex h-full flex-col rounded-panel border border-gray-200 bg-white p-3">
      <div className={`relative flex h-32 items-center justify-center rounded-tile ${tone.bg}`}>
        {chip && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy-900/40 px-2.5 py-0.5 text-sm font-semibold text-white">
            {chip}
          </span>
        )}
        <span aria-hidden className={`text-display-mobile ${tone.text}`}>
          {big}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="text-h3 text-navy-900">{title}</h3>
        {detail && <div className="mt-1 text-gray-700">{detail}</div>}
        {children && <div className="mt-auto pt-4">{children}</div>}
      </div>
    </article>
  );
}

export function ArrowLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-navy-900 hover:bg-green-50 ${ring}`}
    >
      <ArrowUpRight aria-hidden className="size-5" />
    </Link>
  );
}

export function SummaryPanel({
  id,
  title,
  subtitle,
  href,
  hrefLabel,
  cardLabel,
  bigLabel,
  big,
  unit,
  footer,
  stats,
}: {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  hrefLabel: string;
  cardLabel: string;
  bigLabel: string;
  big: ReactNode;
  unit: string;
  footer: string;
  stats: { icon: LucideIcon; value: ReactNode; label: string }[];
}) {
  return (
    <Panel title={title} subtitle={subtitle} id={id} action={<ArrowLink href={href} label={hrefLabel} />}>
      <div className="rounded-panel bg-linear-to-br from-navy-900 to-green-deep p-6 text-white">
        <p className="text-eyebrow uppercase">{cardLabel}</p>
        <p className="mt-5">{bigLabel}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-display-mobile">{big}</span>
          <span className="text-h3">{unit}</span>
        </p>
        <p className="mt-6 font-semibold">{footer}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-tile bg-gray-50 p-4">
            <Icon aria-hidden className="size-5 text-green-700" />
            <p className="mt-2 text-h3 text-navy-900">{value}</p>
            <p className="text-sm text-gray-700">{label}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export type TodayTab = { key: string; label: string; icon: LucideIcon; content: ReactNode };

export function TodayTabs({ id, title, tabs }: { id: string; title: string; tabs: TodayTab[] }) {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  return (
    <section aria-labelledby={`${id}-title`} className="min-w-0 rounded-panel bg-white p-5 md:p-8">
      <h2 id={`${id}-title`} className="text-h3 text-navy-900 md:text-panel">
        {title}
      </h2>
      <div role="tablist" aria-label={title} className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-gray-50 p-1.5">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`${id}-tab-${key}`}
            role="tab"
            aria-selected={active === key}
            aria-controls={`${id}-panel`}
            tabIndex={active === key ? 0 : -1}
            onClick={() => setActive(key)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const i = tabs.findIndex((t) => t.key === active);
              const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].key;
              setActive(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-sm font-semibold sm:text-body ${ring} ${
              active === key ? "bg-green-700 text-white" : "text-navy-900 hover:bg-white"
            }`}
          >
            <Icon aria-hidden className="size-4" /> {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${current.key}`} className="mt-6">
        {current.content}
      </div>
    </section>
  );
}

export function Pill({ label, look }: { label: string; look: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-0.5 text-sm font-semibold ${look}`}>{label}</span>;
}
