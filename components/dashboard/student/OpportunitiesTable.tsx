"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { company } from "@/data/company";
import type { Opportunity } from "@/data/opportunities";
import { noticeText, studentText } from "@/content/dashboard";
import { addNotice, fakeNetwork, readSession, saveToSession } from "@/lib/prototypeStore";

/*
  "Opportunities for you" (redesign Step 7), adapted to the content rules: sample employers only,
  and no match percentages. Skills the student already has are ticked, and the match is said in
  words. Apply opens a confirmation; the application is saved in this browser tab and shows on
  the Opportunities page.
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
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const returnTo = useRef<HTMLElement | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
  useEffect(() => setApplied(readSession<{ id: string }>(OPP_STORE).map((a) => a.id)), []);

  function start(o: Opportunity) {
    returnTo.current = document.activeElement as HTMLElement;
    setCurrent(o);
    setOpen(true);
  }

  async function confirm() {
    if (!current) return;
    setSending(true);
    await fakeNetwork();
    saveToSession(OPP_STORE, { id: current.id, position: current.position, company: current.company });
    if (current.company === company.name) addNotice("company", noticeText.opportunityApplied.replace("{position}", current.position));
    setApplied((a) => [...a, current.id]);
    setSending(false);
    setOpen(false);
    toast.success(d.done);
  }

  return (
    <>
      <div ref={tableRef} tabIndex={-1} className="overflow-hidden rounded-lg border outline-none">
        <Table className="min-w-[40rem]" scrollLabel={t.title}>
          <TableCaption className="sr-only">{t.title}</TableCaption>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead scope="col">{t.columns.company}</TableHead>
              <TableHead scope="col">{t.columns.position}</TableHead>
              <TableHead scope="col">{t.columns.skills}</TableHead>
              <TableHead scope="col">
                <span className="sr-only">{t.apply}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((o) => {
              const have = o.skills.filter((s) => mySkills.includes(s));
              const match = have.length === o.skills.length ? t.matchAll : have.length > 0 ? t.matchSome : t.matchNone;
              const isApplied = applied.includes(o.id);
              return (
                <TableRow key={o.id}>
                  <TableHead scope="row" className="h-auto py-3 font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-brand-navy text-xs font-semibold text-white">{initials(o.company)}</AvatarFallback>
                      </Avatar>
                      <span>
                        <span className="block font-medium text-heading">{o.company}</span>
                        <span className="block text-xs text-muted-foreground">
                          {o.location}
                          {o.mode !== o.location ? ` · ${o.mode}` : ""}
                        </span>
                      </span>
                    </div>
                  </TableHead>
                  <TableCell className="min-w-40 py-3 whitespace-normal">{o.position}</TableCell>
                  <TableCell className="py-3 whitespace-normal">
                    <ul className="flex flex-wrap gap-1.5">
                      {o.skills.map((s) => {
                        const mine = mySkills.includes(s);
                        return (
                          <li key={s}>
                            <Badge variant={mine ? "secondary" : "outline"}>
                              {mine && (
                                <>
                                  <Check data-icon="inline-start" aria-hidden />
                                  <span className="sr-only">{t.youHave}: </span>
                                </>
                              )}
                              {s}
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>
                    {/* Match in words, never a percentage (content rule 4) */}
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span aria-hidden className={`size-2 rounded-full ${have.length ? "bg-brand-green" : "bg-input"}`} />
                      {match}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        <CheckCircle2 aria-hidden className="size-4" /> {t.applied}
                      </span>
                    ) : (
                      <Button variant="navy" size="sm" onClick={() => start(o)}>
                        {t.apply}
                        <span className="sr-only">
                          : {o.position}, {o.company}
                        </span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => !sending && setOpen(v)}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            // The Apply button is replaced by "Applied" once sent, so fall back to the table.
            e.preventDefault();
            if (returnTo.current?.isConnected) returnTo.current.focus();
            else tableRef.current?.focus();
          }}
        >
          {current && (
            <>
              <DialogHeader>
                <DialogTitle>{d.title.replace("{position}", current.position)}</DialogTitle>
                <DialogDescription>{current.description}</DialogDescription>
              </DialogHeader>
              <p className="text-sm">{d.body.replace("{company}", current.company)}</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>
                  {d.cancel}
                </Button>
                <Button variant="navy" onClick={confirm} disabled={sending}>
                  {sending && <Spinner data-icon="inline-start" />}
                  {sending ? d.sending : d.confirm}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
