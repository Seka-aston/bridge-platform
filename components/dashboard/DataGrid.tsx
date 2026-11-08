"use client";

import {
  type ColumnDef, type SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, SearchX } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardText as t } from "@/content/dashboard";

/*
  Shared data table for dashboard lists (redesign Step 6), on the shadcn Table + TanStack Table:
  optional search box, sortable columns (click a header; Enter/Space with the keyboard),
  pages, and a designed empty state. One design for every dashboard table.
*/

export type { ColumnDef };

// Header button for a sortable column.
export function SortHeader({ label, sorted, onToggle }: { label: string; sorted: false | "asc" | "desc"; onToggle: () => void }) {
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <Button variant="ghost" size="sm" className="-ml-2.5 h-8 font-medium" onClick={onToggle}>
      {label}
      <Icon data-icon="inline-end" aria-hidden className={sorted ? "text-heading" : "text-muted-foreground"} />
    </Button>
  );
}

export function DataGrid<T>({
  data,
  columns,
  caption,
  searchLabel,
  searchPlaceholder,
  pageSize = 10,
  toolbar,
  emptyTitle = t.noResults.title,
  emptyBody = t.noResults.body,
}: {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  caption: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  toolbar?: ReactNode;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");
  // TanStack Table manages its own state, so the React Compiler skips this component (expected).
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;
  const { pageIndex } = table.getState().pagination;
  const from = pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);
  const paged = total > pageSize;

  return (
    <div className="space-y-3">
      {(searchLabel || toolbar) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchLabel && (
            <InputGroup className="w-full sm:w-72">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput type="search" aria-label={searchLabel} placeholder={searchPlaceholder} value={filter} onChange={(e) => setFilter(e.target.value)} />
            </InputGroup>
          )}
          {toolbar}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table scrollLabel={caption}>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} scope="col" aria-sort={h.column.getIsSorted() === "asc" ? "ascending" : h.column.getIsSorted() === "desc" ? "descending" : undefined}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id} className="py-2.5">
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <Empty className="py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchX />
                      </EmptyMedia>
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyBody}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {(paged || filter) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {total === 0 ? t.pagination.none : t.pagination.range.replace("{from}", String(from)).replace("{to}", String(to)).replace("{total}", String(total))}
          </p>
          {paged && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                {t.pagination.previous}
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                {t.pagination.next}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
