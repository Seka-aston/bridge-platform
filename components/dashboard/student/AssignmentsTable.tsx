"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataGrid, SortHeader, type ColumnDef } from "@/components/dashboard/DataGrid";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { TextArea } from "@/components/forms/Fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { studentText } from "@/content/dashboard";
import type { Assignment, Course } from "@/data/student";
import { fakeNetwork, readSession, saveToSession } from "@/lib/prototypeStore";

/*
  Assignments (redesign Step 7) on the shared DataGrid: status filter, search, sortable due
  date, and a drawer for each assignment (brief, grade, submit). Submissions are saved in this
  browser tab only (prototype).
*/

const t = studentText.assignments;
const STORE = "bridge-assignment-submissions";
type Filter = "all" | Assignment["status"];
type Row = Assignment & { course: string };

function dueText(n: number) {
  if (n === 0) return t.dueIn.today;
  if (n === 1) return t.dueIn.tomorrow;
  if (n < 0) return t.dueIn.past.replace("{n}", String(-n));
  return t.dueIn.future.replace("{n}", String(n));
}

const statusVariant = { "to-do": "upcoming", submitted: "open", graded: "closed" } as const;

export function AssignmentsTable({ items, courses }: { items: Assignment[]; courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setSubmittedIds(readSession<{ id: string }>(STORE).map((s) => s.id)), []);

  const courseName = (id: string) => courses.find((c) => c.id === id)?.title ?? "";
  const rows: Row[] = items.map((a) => ({
    ...a,
    course: courseName(a.courseId),
    status: submittedIds.includes(a.id) && a.status === "to-do" ? ("submitted" as const) : a.status,
  }));
  const shown = rows.filter((a) => filter === "all" || a.status === filter);
  const open = rows.find((a) => a.id === openId);

  const columns = useMemo<ColumnDef<Row, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: t.columns.title,
        cell: ({ row }) => <span className="font-medium text-heading">{row.original.title}</span>,
      },
      { accessorKey: "course", header: t.columns.course },
      {
        accessorKey: "dueInDays",
        header: ({ column }) => <SortHeader label={t.columns.due} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => <span className="tabular-nums">{dueText(row.original.dueInDays)}</span>,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "status",
        header: t.columns.status,
        cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{t.status[row.original.status]}</Badge>,
        enableGlobalFilter: false,
      },
      {
        id: "action",
        header: () => <span className="sr-only">{t.view}</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenId(row.original.id);
                setNote("");
                setError("");
              }}
            >
              {t.view}
              <span className="sr-only">: {row.original.title}</span>
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  async function submit() {
    if (!note.trim()) {
      setError(t.required);
      return;
    }
    setSending(true);
    await fakeNetwork();
    saveToSession(STORE, { id: openId, note });
    setSubmittedIds((s) => [...s, openId!]);
    setSending(false);
    toast.success(t.submitted);
  }

  return (
    <>
      <DataGrid
        data={shown}
        columns={columns}
        caption={t.title}
        searchLabel={t.searchLabel}
        searchPlaceholder={t.searchLabel}
        toolbar={
          <ToggleGroup type="single" variant="outline" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label={t.columns.status} className="flex-wrap">
            {(Object.keys(t.filter) as Filter[]).map((f) => (
              <ToggleGroupItem key={f} value={f} className="px-3">
                {t.filter[f]} <span className="text-muted-foreground tabular-nums">{f === "all" ? rows.length : rows.filter((a) => a.status === f).length}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      <DetailDrawer open={!!open} onClose={() => setOpenId(null)} title={open?.title ?? ""}>
        {open && (
          <div className="space-y-6 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <Badge variant={statusVariant[open.status]}>{t.status[open.status]}</Badge>
              {open.course} · {dueText(open.dueInDays)}
            </div>
            <div>
              <h3 className="font-semibold text-heading">{t.brief}</h3>
              <p className="mt-1">{open.brief}</p>
            </div>
            {open.grade && (
              <div>
                <h3 className="font-semibold text-heading">{t.grade}</h3>
                <p className="mt-1">{open.grade}</p>
              </div>
            )}
            {open.status === "to-do" && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-heading">{t.submitTitle}</h3>
                <TextArea
                  id="submission"
                  label={t.submitLabel}
                  value={note}
                  onChange={(v) => {
                    setNote(v);
                    setError("");
                  }}
                  error={error}
                />
                <Button onClick={submit} disabled={sending}>
                  {sending && <Spinner data-icon="inline-start" />}
                  {sending ? t.submitting : t.submit}
                </Button>
              </div>
            )}
            {open.status === "submitted" && (
              <Alert variant="success" role="status">
                <CheckCircle2 aria-hidden />
                <AlertDescription>{t.submitted}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DetailDrawer>
    </>
  );
}
