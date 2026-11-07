"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { studentText } from "@/content/dashboard";
import type { Opportunity } from "@/data/opportunities";
import { fakeNetwork, readSession, saveToSession } from "@/lib/prototypeStore";

/*
  "Opportunities for you" from Aston's design, adapted to the content rules: sample employers
  only, and no match percentages. Skills the student already has are ticked, and the Match
  column says it in words. Apply opens a confirmation; the application is saved in this
  browser tab and shows on the Opportunities page.
*/

const t = studentText.opportunities;
const d = studentText.applyDialog;
export const OPP_STORE = "bridge-opportunity-applications";

function initials(name: string) {
  return name.replace("Sample ", "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function OpportunitiesTable({ items, mySkills }: { items: Opportunity[]; mySkills: string[] }) {
  const [applied, setApplied] = useState<string[]>([]);
  const [current, setCurrent] = useState<Opportunity | null>(null);
  const [sending, setSending] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setApplied(readSession<{ id: string }>(OPP_STORE).map((a) => a.id)), []);

  function open(o: Opportunity) {
    returnTo.current = document.activeElement as HTMLElement;
    setCurrent(o);
    dialogRef.current?.showModal();
  }

  async function confirm() {
    if (!current) return;
    setSending(true);
    await fakeNetwork();
    saveToSession(OPP_STORE, { id: current.id, position: current.position, company: current.company });
    setApplied((a) => [...a, current.id]);
    setSending(false);
    dialogRef.current?.close();
  }

  return (
    <>
      <div role="region" aria-label={t.title} tabIndex={0} className="overflow-x-auto rounded-tile focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900">
        <table className="w-full min-w-[40rem] border-separate border-spacing-y-1 text-left">
          <caption className="sr-only">{t.title}</caption>
          <thead>
            <tr>
              {[t.columns.company, t.columns.position, t.columns.skills].map((h) => (
                <th key={h} scope="col" className="px-3 pb-2 font-semibold text-gray-700">
                  {h}
                </th>
              ))}
              <th scope="col" className="pb-2">
                <span className="sr-only">{t.apply}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => {
              const have = o.skills.filter((s) => mySkills.includes(s));
              const match = have.length === o.skills.length ? t.matchAll : have.length > 0 ? t.matchSome : t.matchNone;
              const isApplied = applied.includes(o.id);
              return (
                <tr key={o.id} className="group">
                  <th scope="row" className="rounded-l-tile px-3 py-3 font-normal group-hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span aria-hidden className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white">
                        {initials(o.company)}
                      </span>
                      <span>
                        <span className="block whitespace-nowrap font-semibold text-navy-900">{o.company}</span>
                        <span className="block whitespace-nowrap text-sm text-gray-700">
                          {o.location}
                          {o.mode !== o.location ? ` · ${o.mode}` : ""}
                        </span>
                      </span>
                    </div>
                  </th>
                  <td className="min-w-40 px-3 py-3 text-gray-800 group-hover:bg-gray-50">{o.position}</td>
                  <td className="px-3 py-3 group-hover:bg-gray-50">
                    <ul className="flex flex-wrap gap-2">
                      {o.skills.map((s) => (
                        <li key={s} className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-navy-900 group-hover:bg-white">
                          {mySkills.includes(s) && (
                            <>
                              <Check aria-hidden className="size-3.5 text-green-700" />
                              <span className="sr-only">{t.youHave}: </span>
                            </>
                          )}
                          {s}
                        </li>
                      ))}
                    </ul>
                    {/* Match in words, never a percentage (content rule 4) */}
                    <p className="mt-2 inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-navy-900">
                      <span aria-hidden className={`size-2.5 rounded-full ${have.length ? "bg-green-500" : "bg-gray-500"}`} />
                      {match}
                    </p>
                  </td>
                  <td className="rounded-r-tile px-3 py-3 text-right group-hover:bg-gray-50">
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
                        <CheckCircle2 aria-hidden className="size-4" /> {t.applied}
                      </span>
                    ) : (
                      <Button variant="navy" shape="pill" onClick={() => open(o)}>
                        {t.apply}
                        <span className="sr-only">: {o.position}, {o.company}</span>
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="apply-dialog-title"
        onClose={() => returnTo.current?.focus()}
        onClick={(e) => e.target === dialogRef.current && !sending && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-panel bg-white p-0 backdrop:bg-navy-900/60"
      >
        {current && (
          <div className="p-6">
            <h2 id="apply-dialog-title" className="text-h3 text-navy-900">
              {d.title.replace("{position}", current.position)}
            </h2>
            <p className="mt-2 text-gray-700">{current.description}</p>
            <p className="mt-4 text-gray-800">{d.body.replace("{company}", current.company)}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="outline" shape="pill" onClick={() => dialogRef.current?.close()} disabled={sending}>
                {d.cancel}
              </Button>
              <Button variant="navy" shape="pill" onClick={confirm} disabled={sending}>
                {sending ? d.sending : d.confirm}
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
