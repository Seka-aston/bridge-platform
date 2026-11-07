"use client";

import { BadgeCheck, Clock, Copy, ExternalLink, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ErrorText } from "@/components/forms/Fields";
import { studentText } from "@/content/dashboard";
import type { Skill } from "@/data/student";
import { school } from "@/data/school";
import { addNotice, readSession, saveToSession, VERIFY_STORE } from "@/lib/prototypeStore";
import { noticeText } from "@/content/dashboard";

/*
  Skills list with "Add New Skill" (opens automatically when arriving from the overview's
  button via #add) and "Copy shareable link". Added skills show as pending verification and
  are kept in this browser tab only.
*/

const t = studentText.passportPage;
const STORE = "bridge-added-skills";

export function PassportActions({ publicHref, onAdd }: { publicHref: string; onAdd: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <Button shape="pill" onClick={onAdd}>
        <Plus aria-hidden className="size-5" /> {studentText.addSkill}
      </Button>
      <Button
        variant="outline"
        shape="pill"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(new URL(publicHref, window.location.origin).toString());
          } catch {}
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }}
      >
        <Copy aria-hidden className="size-5" /> {copied ? t.copied : t.share}
      </Button>
      <Button href={publicHref} variant="text">
        <ExternalLink aria-hidden className="size-4" /> {t.viewPublic}
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? t.copied : ""}
      </span>
    </>
  );
}

export function SkillsSection({ skills, publicHref }: { skills: Skill[]; publicHref: string }) {
  const [added, setAdded] = useState<Skill[]>([]);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setAdded(readSession<Skill>(STORE));
    try {
      setDecisions(JSON.parse(sessionStorage.getItem(VERIFY_STORE) ?? "{}"));
    } catch {}
    if (window.location.hash === "#add") dialogRef.current?.showModal();
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
    setJustAdded(true);
    dialogRef.current?.close();
  }

  const row = (s: Skill) => (
    <li key={s.name + (s.verified ? "v" : "p")} className="flex items-start justify-between gap-4 border-b border-gray-200 py-3 last:border-0">
      <div>
        <p className="font-semibold text-navy-900">{s.name}</p>
        {s.verifiedBy && <p className="text-sm text-gray-700">{t.verifiedBy.replace("{by}", s.verifiedBy)}</p>}
        {s.evidence && <p className="text-sm text-gray-700">{t.evidence.replace("{e}", s.evidence)}</p>}
      </div>
      {s.verified ? (
        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-green-700">
          <BadgeCheck aria-hidden className="size-4" /> {t.verified}
        </span>
      ) : (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-gray-700">
          <Clock aria-hidden className="size-4" /> {t.pending}
        </span>
      )}
    </li>
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <PassportActions publicHref={publicHref} onAdd={() => dialogRef.current?.showModal()} />
      </div>
      {justAdded && (
        <p role="status" className="mt-4 rounded-tile bg-green-50 p-4 text-gray-800">
          {t.added}
        </p>
      )}
      <section aria-labelledby="skills-title" className="mt-6 rounded-panel bg-white p-5 md:p-8">
        <h2 id="skills-title" className="text-h3 text-navy-900 md:text-panel">
          {t.skillsTitle} ({verified.length} {t.verified.toLowerCase()}, {pending.length} {t.pending.toLowerCase()})
        </h2>
        <div className="mt-4 grid gap-x-10 lg:grid-cols-2">
          <ul>{verified.slice(0, Math.ceil(verified.length / 2)).map(row)}</ul>
          <ul>{[...verified.slice(Math.ceil(verified.length / 2)), ...pending].map(row)}</ul>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="add-skill-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-panel bg-white p-0 backdrop:bg-navy-900/60"
      >
        <form noValidate onSubmit={add} className="space-y-4 p-6">
          <h2 id="add-skill-title" className="text-h3 text-navy-900">
            {t.addTitle}
          </h2>
          <div>
            <label htmlFor="skill-name" className="block font-semibold text-navy-900">
              {t.addName}
            </label>
            <input
              id="skill-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "skill-name-error" : undefined}
              className="mt-2 block w-full rounded-control border border-gray-500 px-3 py-2 text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
            />
            <ErrorText id="skill-name-error" error={error} />
          </div>
          <div>
            <label htmlFor="skill-evidence" className="block font-semibold text-navy-900">
              {t.addEvidence}
            </label>
            <textarea
              id="skill-evidence"
              rows={3}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="mt-2 block w-full rounded-control border border-gray-500 px-3 py-2 text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" shape="pill" onClick={() => dialogRef.current?.close()}>
              {t.addCancel}
            </Button>
            <Button type="submit" shape="pill">
              {t.addSubmit}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
