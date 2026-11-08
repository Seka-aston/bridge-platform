import { ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sharedText } from "@/content/dashboard";

/*
  Simple accessible charts for admin reports (Checkpoint 10; shadcn tokens since redesign Step 7),
  following the dataviz method:
  - one series per chart, one hue (primary green-700, 5.3:1 on white), so no legend: the title names it
  - thin bars with a 4px rounded end away from the baseline, 2px gaps, recessive gridlines
  - hover AND keyboard focus show a tooltip; every bar is reachable with Tab
  - values are always available as text: a "Show as table" view sits under each chart
  - labels and values use text colours, never the bar colour
*/

type Datum = { label: string; value: number };

function TableView({ data, labelHeader }: { data: Datum[]; labelHeader: string }) {
  return (
    <details className="group/details mt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-sm text-sm font-medium text-link hover:text-link-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <ChevronRight aria-hidden className="size-4 transition-transform group-open/details:rotate-90" />
        {sharedText.showTable}
      </summary>
      <div className="mt-3 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead scope="col">{labelHeader}</TableHead>
              <TableHead scope="col" className="text-right">
                {sharedText.value}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.label}>
                <TableHead scope="row" className="h-auto py-2 font-normal text-foreground">
                  {d.label}
                </TableHead>
                <TableCell className="py-2 text-right font-medium text-heading tabular-nums">{d.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </details>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="presentation"
      className="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-brand-navy px-2.5 py-1 text-xs font-medium text-white shadow-md group-hover:block group-focus:block"
    >
      {children}
    </span>
  );
}

// Horizontal bars: category labels on the left, value at the end of each bar.
export function BarChart({ data, labelHeader }: { data: Datum[]; labelHeader: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <figure>
      <ul className="space-y-0.5">
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[minmax(8rem,14rem)_1fr] items-center gap-3 py-1.5">
            <span className="text-sm">{d.label}</span>
            <span
              tabIndex={0}
              role="img"
              aria-label={`${d.label}: ${d.value}`}
              className="group relative flex items-center gap-2 rounded-sm py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="h-3 rounded-r-sm bg-primary" style={{ width: `${(d.value / max) * 85}%` }} />
              <span className="text-sm font-medium text-heading tabular-nums">{d.value}</span>
              <Tooltip>
                {d.label}: {d.value}
              </Tooltip>
            </span>
          </li>
        ))}
      </ul>
      <TableView data={data} labelHeader={labelHeader} />
    </figure>
  );
}

// Vertical columns over time, with three recessive gridlines. Only the latest value is labelled.
export function ColumnChart({ data, labelHeader }: { data: Datum[]; labelHeader: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const top = Math.ceil(max / 10) * 10;
  const grid = [top, Math.round(top / 2), 0];
  return (
    <figure>
      <div className="relative h-52 pl-8">
        {grid.map((g) => (
          <div key={g} className="absolute left-8 right-0 border-t border-border" style={{ bottom: `${(g / top) * 100}%` }}>
            <span className="absolute -left-8 -top-2.5 w-6 text-right text-xs text-muted-foreground tabular-nums">{g}</span>
          </div>
        ))}
        <ul className="relative flex h-full items-end gap-0.5">
          {data.map((d, i) => (
            <li key={d.label} className="flex h-full flex-1 flex-col justify-end">
              <span
                tabIndex={0}
                role="img"
                aria-label={`${d.label}: ${d.value}`}
                className="group relative mx-auto flex h-full w-full max-w-10 items-end justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="w-3/5 rounded-t-sm bg-primary" style={{ height: `${(d.value / top) * 100}%` }} />
                {i === data.length - 1 && (
                  <span className="absolute text-xs font-medium text-heading tabular-nums" style={{ bottom: `calc(${(d.value / top) * 100}% + 4px)` }}>
                    {d.value}
                  </span>
                )}
                <Tooltip>
                  {d.label}: {d.value}
                </Tooltip>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ul aria-hidden className="mt-2 flex gap-0.5 pl-8">
        {data.map((d) => (
          <li key={d.label} className="flex-1 text-center text-xs text-muted-foreground">
            {d.label}
          </li>
        ))}
      </ul>
      <TableView data={data} labelHeader={labelHeader} />
    </figure>
  );
}
