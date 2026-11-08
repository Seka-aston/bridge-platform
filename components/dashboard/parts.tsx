import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageTitle, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/*
  Shared dashboard building blocks (redesign Step 6), on shadcn/ui. Server-friendly: no client
  state here. Same props as before, so every dashboard screen uses them unchanged.
  Dashboards are denser than marketing pages: 24px page titles, 18px section titles, 14px text.
*/

// Page header pattern: title, short description, primary action(s) on the right.
// (The breadcrumb lives in the top bar.) `large` is kept for the overview's welcome line.
export function DashPageHeader({
  title,
  description,
  actions,
  large = false,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <PageTitle className={cn(large && "md:text-3xl")}>{title}</PageTitle>
        {description && <div className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

// A titled card that groups a table, list or chart.
export function Panel({
  title,
  id,
  children,
  action,
  subtitle,
  className,
}: {
  title: string;
  id: string;
  children: ReactNode;
  action?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <Card as="section" aria-labelledby={id} className={cn("min-w-0", className)}>
      <CardHeader>
        <SectionTitle id={id}>{title}</SectionTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  );
}

// One stat card design for every dashboard.
export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: ReactNode; icon: LucideIcon; hint?: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="font-medium">{label}</CardDescription>
        <CardAction>
          <Icon aria-hidden className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl leading-none font-semibold text-heading tabular-nums">{value}</p>
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

// Accessible progress bar: the number is always shown as text too.
export function ProgressBar({ label, value, hideLabel = false }: { label: string; value: number; hideLabel?: boolean }) {
  return (
    <div>
      {!hideLabel && (
        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
          <span>{label}</span>
          <span className="font-medium text-heading tabular-nums">{value}%</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <Progress value={value} aria-label={label} />
        {hideLabel && <span className="w-10 shrink-0 text-right text-sm font-medium text-heading tabular-nums">{value}%</span>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <Empty className="border bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{body}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button asChild variant="outline" size="sm">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

// Simple, accessible table on the shadcn Table. Narrow screens scroll it sideways inside its
// own frame. For sorting, filtering and pages, use DataGrid (components/dashboard/DataGrid.tsx).
export type Column = { key: string; header: string; className?: string };

export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: Column[];
  rows: { key: string; cells: Record<string, ReactNode> }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="min-w-[40rem]" scrollLabel={caption}>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader className="bg-muted">
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} scope="col" className={c.className}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.key}>
              {columns.map((c, i) =>
                i === 0 ? (
                  <TableHead key={c.key} scope="row" className={cn("h-auto py-2.5 font-medium text-heading", c.className)}>
                    {r.cells[c.key]}
                  </TableHead>
                ) : (
                  <TableCell key={c.key} className={cn("py-2.5", c.className)}>
                    {r.cells[c.key]}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ListItem({ title, meta, end }: { title: ReactNode; meta?: ReactNode; end?: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-0">
      <div className="min-w-0">
        <p className="font-medium text-heading">{title}</p>
        {meta && <p className="text-muted-foreground">{meta}</p>}
      </div>
      {end && <div className="shrink-0">{end}</div>}
    </li>
  );
}
