"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Copy, ExternalLink, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextArea, TextField } from "@/components/forms/Fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/ui/typography";
import { noticeText, studentText } from "@/content/dashboard";
import { school } from "@/data/school";
import type { Skill } from "@/data/student";
import { addNotice, readSession, saveToSession, VERIFY_STORE } from "@/lib/prototypeStore";

/*
  Skills list (redesign Step 7) with "Add New Skill" (opens automatically when arriving from the
  overview's button via #add) and "Copy shareable link". Added skills show as pending
  verification and are kept in this browser tab only.
*/

const t = studentText.passportPage;
const STORE = "bridge-added-skills";

export function PassportActions({ publicHref, onAdd }: { publicHref: string; onAdd: () => void }) {
  return (
    <>
      <Button onClick={onAdd}>
        <Plus data-icon="inline-start" aria-hidden /> {studentText.addSkill}
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(new URL(publicHref, window.location.origin).toString());
          } catch {}
          toast.success(t.copied);
        }}
      >
        <Copy data-icon="inline-start" aria-hidden /> {t.share}
      </Button>
      <Button asChild variant="ghost">
        <Link href={publicHref}>
          <ExternalLink data-icon="inline-start" aria-hidden /> {t.viewPublic}
        </Link>
      </Button>
    </>
  );
}

export function SkillsSection({ skills, publicHref }: { skills: Skill[]; publicHref: string }) {
  const [added, setAdded] = useState<Skill[]>([]);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage and address, read after mount */
    setAdded(readSession<Skill>(STORE));
    try {
      setDecisions(JSON.parse(sessionStorage.getItem(VERIFY_STORE) ?? "{}"));
    } catch {}
    if (window.location.hash === "#add") setOpen(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Skills the school verified during the demo show as verified here.
  const all = [...skills, ...added].map((s) =>
    !s.verified && decisions[`sample-1:${s.name}`] === "verified" ? { ...s, verified: true, verifiedBy: school.name } : s,
  );
  const verified = all.filter((s) => s.verified);
  const pending = all.filter((s) => !s.verified);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.addRequired);
      return;
    }
    const skill: Skill = { name: name.trim(), verified: false, evidence: evidence.trim() || undefined };
    saveToSession(STORE, skill);
    addNotice("school", noticeText.skillAdded.replace("{skill}", skill.name));
    setAdded((a) => [...a, skill]);
    setName("");
    setEvidence("");
    setOpen(false);
    toast.success(t.added);
  }

  const row = (s: Skill) => (
    <li key={s.name + (s.verified ? "v" : "p")} className="flex items-start justify-between gap-4 py-3 text-sm">
      <div className="min-w-0">
        <p className="font-medium text-heading">{s.name}</p>
        {s.verifiedBy && <p className="text-xs text-muted-foreground">{t.verifiedBy.replace("{by}", s.verifiedBy)}</p>}
        {s.evidence && <p className="text-xs text-muted-foreground">{t.evidence.replace("{e}", s.evidence)}</p>}
      </div>
      {s.verified ? (
        <Badge variant="verified">
          <BadgeCheck data-icon="inline-start" aria-hidden /> {t.verified}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock data-icon="inline-start" aria-hidden /> {t.pending}
        </Badge>
      )}
    </li>
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PassportActions publicHref={publicHref} onAdd={() => setOpen(true)} />
      </div>
      <Card as="section" aria-labelledby="skills-title" className="mt-6">
        <CardHeader>
          <SectionTitle id="skills-title">{t.skillsTitle}</SectionTitle>
          <CardDescription>
            {verified.length} {t.verified.toLowerCase()} · {pending.length} {t.pending.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-x-10 lg:grid-cols-2">
          <ul className="divide-y">{verified.slice(0, Math.ceil(verified.length / 2)).map(row)}</ul>
          <ul className="divide-y border-t lg:border-t-0">{[...verified.slice(Math.ceil(verified.length / 2)), ...pending].map(row)}</ul>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form noValidate onSubmit={add} className="grid gap-6">
            <DialogHeader>
              <DialogTitle>{t.addTitle}</DialogTitle>
              <DialogDescription>{t.addHelp}</DialogDescription>
            </DialogHeader>
            <TextField
              id="skill-name"
              label={t.addName}
              required
              value={name}
              onChange={(v) => {
                setName(v);
                setError("");
              }}
              error={error}
            />
            <TextArea id="skill-evidence" label={t.addEvidence} value={evidence} onChange={setEvidence} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t.addCancel}
              </Button>
              <Button type="submit">{t.addSubmit}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
