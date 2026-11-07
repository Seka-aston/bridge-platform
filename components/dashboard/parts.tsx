import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";

/*
  Dashboard building blocks (Checkpoint 6). Server-friendly: no client state here.
  Interactive pieces (drawer, filters) live in their own client files.
*/

export function DashPageHeader({
  title,
  description,
  actions,
  large = false,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  large?: boolean; // the overview's big welcome line
}) {
  return (
    <div className="flex flex-col gap-4 px-1 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className={`text-navy-900 ${large ? "text-display-mobile md:text-display" : "text-h2-mobile md:text-h2"}`}>{title}</h1>
        {description && <p className={`mt-2 max-w-2xl text-gray-700 ${large ? "text-body-lg" : ""}`}>{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

// A titled white panel that groups a table, list or chart.
export function Panel({
  title,
  id,
  children,
  action,
  subtitle,
  className = "",
}: {
  title: string;
  id: string;
  children: ReactNode;
  action?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`min-w-0 rounded-panel bg-white p-5 md:p-8 ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 id={id} className="text-h3 text-navy-900 md:text-panel">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-gray-700">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: ReactNode; icon: LucideIcon; hint?: string }) {
  return (
    <div className="rounded-panel bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-700">{label}</p>
        <span className="inline-flex size-9 items-center justify-center rounded-control bg-green-50">
          <Icon aria-hidden className="size-5 text-green-700" />
        </span>
      </div>
      <p className="mt-3 text-h2-mobile text-navy-900">{value}</p>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
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
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-gray-800">{label}</span>
          <span className="font-semibold text-navy-900">{value}%</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        >
          <div className="h-full rounded-full bg-green-700" style={{ width: `${value}%` }} />
        </div>
        {hideLabel && <span className="w-10 shrink-0 text-right font-semibold text-navy-900">{value}%</span>}
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
    <div className="flex flex-col items-center rounded-panel border border-dashed border-gray-500 bg-white px-6 py-12 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-green-50">
        <Icon aria-hidden className="size-6 text-green-700" />
      </span>
      <p className="mt-4 text-h3 text-navy-900">{title}</p>
      <p className="mt-2 max-w-md text-gray-700">{body}</p>
      {action && (
        <div className="mt-6">
          <Button href={action.href} variant="outline" shape="pill">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

// Simple, accessible table. On narrow screens it scrolls sideways inside its own frame
// (keyboard users can focus the frame to scroll it).
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
  // `relative` keeps screen-reader-only labels inside this scrolling frame, so they can't widen the page.
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="relative overflow-x-auto rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-3 py-3 text-eyebrow uppercase text-gray-700 ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-gray-200 last:border-0">
              {columns.map((c, i) =>
                i === 0 ? (
                  <th key={c.key} scope="row" className={`px-3 py-3 font-semibold text-navy-900 ${c.className ?? ""}`}>
                    {r.cells[c.key]}
                  </th>
                ) : (
                  <td key={c.key} className={`px-3 py-3 text-gray-800 ${c.className ?? ""}`}>
                    {r.cells[c.key]}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListItem({ title, meta, end }: { title: ReactNode; meta?: ReactNode; end?: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-gray-200 py-3 last:border-0">
      <div className="min-w-0">
        <p className="font-semibold text-navy-900">{title}</p>
        {meta && <p className="text-sm text-gray-700">{meta}</p>}
      </div>
      {end && <div className="shrink-0">{end}</div>}
    </li>
  );
}
