"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { OPP_STORE } from "@/components/dashboard/student/OpportunitiesTable";
import { applicants as sampleApplicants, postings as samplePostings, type Applicant, type Posting, type PostingStatus, type Stage } from "@/data/company";
import { readSession } from "@/lib/prototypeStore";

/*
  Company dashboard data in the browser (Checkpoint 8): the sample data plus anything changed
  during the demo, kept in this browser tab only. One provider per screen so every panel
  (snapshot, lists, drawers) stays in sync.

  Connected journey: if the student applied to this company's "o1" internship in this tab,
  that application appears here as a new applicant.
*/

export type CompanyApplicant = Applicant & { fromSession?: boolean };

type Ctx = {
  ready: boolean;
  postings: Posting[];
  applicants: CompanyApplicant[];
  shortlist: string[];
  toggleShortlist: (talentId: string) => void;
  setStage: (applicantId: string, stage: Stage) => void;
  setPostingStatus: (postingId: string, status: PostingStatus) => void;
  addPosting: (p: Posting) => void;
};

const CompanyCtx = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const KEYS = { shortlist: "bridge-shortlist", stages: "bridge-stage-overrides", status: "bridge-posting-status", newPostings: "bridge-new-postings" };

export function CompanyDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [stages, setStages] = useState<Record<string, Stage>>({});
  const [status, setStatus] = useState<Record<string, PostingStatus>>({});
  const [newPostings, setNewPostings] = useState<Posting[]>([]);
  const [sessionApps, setSessionApps] = useState<CompanyApplicant[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage, read once after mount */
    setShortlist(load(KEYS.shortlist, []));
    setStages(load(KEYS.stages, {}));
    setStatus(load(KEYS.status, {}));
    setNewPostings(load(KEYS.newPostings, []));
    const applied = readSession<{ id: string; savedAt: string }>(OPP_STORE).filter((a) => a.id === "o1");
    setSessionApps(
      applied.slice(0, 1).map(() => ({ id: "session-diane", talentId: "sample-1", postingId: "o1", stage: "new" as Stage, appliedDaysAgo: 0, fromSession: true })),
    );
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggleShortlist = useCallback((id: string) => {
    setShortlist((s) => {
      const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      save(KEYS.shortlist, next);
      return next;
    });
  }, []);
  const setStage = useCallback((id: string, stage: Stage) => {
    setStages((s) => {
      const next = { ...s, [id]: stage };
      save(KEYS.stages, next);
      return next;
    });
  }, []);
  const setPostingStatus = useCallback((id: string, st: PostingStatus) => {
    setStatus((s) => {
      const next = { ...s, [id]: st };
      save(KEYS.status, next);
      return next;
    });
  }, []);
  const addPosting = useCallback((p: Posting) => {
    setNewPostings((s) => {
      const next = [p, ...s];
      save(KEYS.newPostings, next);
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      postings: [...newPostings, ...samplePostings].map((p) => ({ ...p, status: status[p.id] ?? p.status })),
      applicants: [...sessionApps, ...sampleApplicants].map((a) => ({ ...a, stage: stages[a.id] ?? a.stage })),
      shortlist,
      toggleShortlist,
      setStage,
      setPostingStatus,
      addPosting,
    }),
    [ready, newPostings, status, sessionApps, stages, shortlist, toggleShortlist, setStage, setPostingStatus, addPosting],
  );

  return <CompanyCtx.Provider value={value}>{children}</CompanyCtx.Provider>;
}

export function useCompanyData() {
  const ctx = useContext(CompanyCtx);
  if (!ctx) throw new Error("useCompanyData must be used inside CompanyDataProvider");
  return ctx;
}

export const isActiveStage = (s: Stage) => s !== "not-progressing";
