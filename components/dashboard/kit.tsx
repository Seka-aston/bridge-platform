"use client";

import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Panel } from "@/components/dashboard/parts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sharedText } from "@/content/dashboard";
import { cn } from "@/lib/utils";

/*
  Shared dashboard pieces on shadcn/ui (redesign Step 7), used by the Company, School
  and Admin dashboards: navy summary card with a strip of figures, the tabbed
  "what's next today?" panel, initials avatars and compact table-toolbar dropdowns.
*/

export function ago(n: number) {
  return sharedText.agoDays[String(n)] ?? sharedText.agoDays.n.replace("{n}", String(n));
}

export function initialsOf(name: string) {
  return name.replace("Sample ", "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-brand-navy text-xs font-semibold text-white">{initialsOf(name)}</AvatarFallback>
    </Avatar>
  );
}

// Navy card with one headline figure (white text on navy, 10.9:1) and a decorative green arc.
export function NavySummaryCard({ cardLabel, bigLabel, big, unit, footer, chip }: { cardLabel: string; bigLabel: string; big: ReactNode; unit: string; footer: ReactNode; chip?: ReactNode }) {
  return (
    <div className="surface-navy relative overflow-hidden rounded-xl p-5">
      <span aria-hidden className="pointer-events-none absolute -right-14 -bottom-20 size-44 rounded-full border-[18px] border-brand-green/25" />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase">{cardLabel}</p>
        {chip}
      </div>
      <p className="relative mt-6 text-sm text-muted-foreground">{bigLabel}</p>
      <p className="relative mt-1 flex items-baseline gap-2">
        <span className="font-heading text-4xl leading-none font-bold tabular-nums">{big}</span>
        <span className="text-sm font-medium">{unit}</span>
      </p>
      <div className="relative mt-6 border-t border-border pt-3 text-sm font-semibold">{footer}</div>
    </div>
  );
}

export function StatStrip({ stats }: { stats: { value: ReactNode; label: string }[] }) {
  return (
    <dl className="grid grid-cols-3 divide-x rounded-lg border">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 p-3">
          <dt className="text-xs leading-tight text-muted-foreground">{s.label}</dt>
          <dd className="order-first text-xl leading-none font-semibold text-heading tabular-nums">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SummaryPanel({
  id, title, subtitle, href, hrefLabel, cardLabel, bigLabel, big, unit, footer, stats,
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
  footer: ReactNode;
  // `icon` is accepted for older callers and not drawn.
  stats: { value: ReactNode; label: string; icon?: LucideIcon }[];
}) {
  return (
    <Panel
      title={title}
      subtitle={subtitle}
      id={id}
      action={
        <Button asChild variant="ghost" size="icon-sm">
          <Link href={href} aria-label={hrefLabel}>
            <ArrowUpRight />
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <NavySummaryCard cardLabel={cardLabel} bigLabel={bigLabel} big={big} unit={unit} footer={footer} />
        <StatStrip stats={stats} />
      </div>
    </Panel>
  );
}

export type TodayTab = { key: string; label: string; icon?: LucideIcon; content: ReactNode };

export function TodayTabs({ id, title, tabs }: { id: string; title: string; tabs: TodayTab[] }) {
  return (
    <Panel title={title} id={`${id}-title`}>
      <Tabs defaultValue={tabs[0].key}>
        <TabsList aria-label={title} className="w-full">
          {/* Labels only: with icons, longer labels ("Programmes") don't fit the narrow side column. */}
          {tabs.map(({ key, label }) => (
            <TabsTrigger key={key} value={key} id={`${id}-tab-${key}`}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-4 space-y-4">
            {t.content}
          </TabsContent>
        ))}
      </Tabs>
    </Panel>
  );
}

// Building blocks for a "today" tab.
export function TodayText({ title, body }: { title: string; body?: ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-heading">{title}</h3>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
    </div>
  );
}
export function TodayAction({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" className="w-full">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
export function TodayItem({ icon: Icon, title, detail }: { icon: LucideIcon; title: ReactNode; detail: ReactNode }) {
  return (
    <Item variant="muted" size="sm">
      <ItemMedia variant="icon">
        <Icon aria-hidden className="text-primary" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-heading">{title}</ItemTitle>
        <ItemDescription>{detail}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

// Compact filter for a table toolbar. The trigger is named by aria-label, and its value
// ("All classes") shows what it filters. Radix Select can't use "" as a value, so callers use "any".
export function ToolbarSelect({
  label, value, onChange, options, className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className={cn("w-full bg-background sm:w-48", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
