"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { DataTable } from "@/components/dashboard/parts";
import { ErrorText } from "@/components/forms/Fields";
import { studentText } from "@/content/dashboard";
import type { Assignment, Course } from "@/data/student";
import { fakeNetwork, readSession, saveToSession } from "@/lib/prototypeStore";

/*
  Assignments list with a status filter and a drawer for each assignment (brief, grade,
  submit). Submissions are saved in this browser tab only (prototype).
*/

const t = studentText.assignments;
const STORE = "bridge-assignment-submissions";
type Filter = "all" | Assignment["status"];

function dueText(n: number) {
  if (n === 0) return t.dueIn.today;
  if (n === 1) return t.dueIn.tomorrow;
  if (n < 0) return t.dueIn.past.replace("{n}", String(-n));
  return t.dueIn.future.replace("{n}", String(n));
}

const statusLook: Record<Assignment["status"], string> = {
  "to-do": "border border-navy-900 text-navy-900",
  submitted: "bg-green-50 text-green-700",
  graded: "bg-gray-200 text-gray-800",
};

export function AssignmentsTable({ items, courses }: { items: Assignment[]; courses: Course[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setSubmittedIds(readSession<{ id: string }>(STORE).map((s) => s.id)), []);

  const withStatus = items.map((a) => ({ ...a, status: submittedIds.includes(a.id) && a.status === "to-do" ? ("submitted" as const) : a.status }));
  const shown = withStatus.filter((a) => filter === "all" || a.status === filter);
  const open = withStatus.find((a) => a.id === openId);
  const courseName = (id: string) => courses.find((c) => c.id === id)?.title ?? "";

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
  }

  return (
    <div>
      <div role="group" aria-label={t.columns.status} className="flex flex-wrap gap-2">
        {(Object.keys(t.filter) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
              filter === f ? "bg-green-700 text-white" : "bg-gray-50 text-navy-900 hover:bg-green-50"
            }`}
          >
            {t.filter[f]} ({f === "all" ? withStatus.length : withStatus.filter((a) => a.status === f).length})
          </button>
        ))}
      </div>
      <div className="mt-6">
        <DataTable
          caption={t.title}
          columns={[
            { key: "title", header: t.columns.title },
            { key: "course", header: t.columns.course },
            { key: "due", header: t.columns.due },
            { key: "status", header: t.columns.status },
            { key: "action", header: "", className: "text-right" },
          ]}
          rows={shown.map((a) => ({
            key: a.id,
            cells: {
              title: a.title,
              course: courseName(a.courseId),
              due: dueText(a.dueInDays),
              status: <span className={`inline-flex rounded-full px-3 py-0.5 text-sm font-semibold ${statusLook[a.status]}`}>{t.status[a.status]}</span>,
              action: (
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(a.id);
                    setNote("");
                    setError("");
                  }}
                  className="rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                >
                  {t.view}
                  <span className="sr-only">: {a.title}</span>
                </button>
              ),
            },
          }))}
        />
      </div>

      <DetailDrawer open={!!open} onClose={() => setOpenId(null)} title={open?.title ?? ""}>
        {open && (
          <div className="space-y-6">
            <p className="text-gray-700">
              {courseName(open.courseId)} · {dueText(open.dueInDays)}
            </p>
            <div>
              <h3 className="font-bold text-navy-900">{t.brief}</h3>
              <p className="mt-1 text-gray-800">{open.brief}</p>
            </div>
            {open.grade && (
              <div>
                <h3 className="font-bold text-navy-900">{t.grade}</h3>
                <p className="mt-1 text-gray-800">{open.grade}</p>
              </div>
            )}
            {open.status === "to-do" && (
              <div>
                <h3 className="font-bold text-navy-900">{t.submitTitle}</h3>
                <label htmlFor="submission" className="mt-3 block font-semibold text-navy-900">
                  {t.submitLabel}
                </label>
                <textarea
                  id="submission"
                  rows={4}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setError("");
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "submission-error" : undefined}
                  className="mt-2 block w-full rounded-control border border-gray-500 px-3 py-2 text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                />
                <ErrorText id="submission-error" error={error} />
                <div className="mt-4">
                  <Button shape="pill" onClick={submit} disabled={sending}>
                    {sending ? t.submitting : t.submit}
                  </Button>
                </div>
              </div>
            )}
            {open.status === "submitted" && (
              <p role="status" className="flex items-start gap-2 rounded-tile bg-green-50 p-4 text-gray-800">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" /> {t.submitted}
              </p>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
