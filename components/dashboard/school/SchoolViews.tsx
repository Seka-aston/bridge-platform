"use client";

import { BadgeCheck, BookOpen, Briefcase, CheckCircle2, Clock, GraduationCap, Info, ShieldCheck, Users, UserPlus } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { TalentCard } from "@/components/TalentCard";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { DataTable, EmptyState, Panel, ProgressBar } from "@/components/dashboard/parts";
import { ago, ColorTile, Pill, ring, SummaryPanel, TodayTabs } from "@/components/dashboard/kit";
import { ErrorSummary, TextField } from "@/components/forms/Fields";
import { noticeText, schoolText as t, sharedText } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { learnerProgress } from "@/data/dashboard";
import { programmes } from "@/data/programmes";
import {
  classes, facilitators as sampleFacilitators, placements, programmeParticipation, school, verificationRequests, type Facilitator, type PlacementStatus, type VerificationRequest,
} from "@/data/school";
import { skills as studentSkills, type Skill } from "@/data/student";
import { talentProfiles } from "@/data/talent";
import { formatDate, programmeStatus, todayInKigali, type ProgrammeStatus } from "@/lib/programmes";
import { addNotice, isEmail, readSession, VERIFY_STORE } from "@/lib/prototypeStore";
import { StatusPill } from "@/components/StatusPill";
import { talentCardText } from "@/content/ui";

/*
  School dashboard (Checkpoint 9), in the student dashboard's visual language.
  Connected journey: skills the student adds (or has pending) arrive here as verification
  requests; verifying one marks it verified on the student's Skills Passport.
  Everything changed is kept in this browser tab only.
*/

const FAC_STORE = "bridge-added-facilitators";
const byId = (id: string) => talentProfiles.find((p) => p.id === id)!;

type Request = VerificationRequest & { fromSession?: boolean };
type Ctx = {
  ready: boolean;
  today: string;
  requests: Request[];
  decisions: Record<string, "verified" | "declined">;
  decide: (r: Request, d: "verified" | "declined") => void;
  facilitators: Facilitator[];
  addFacilitator: (f: Facilitator) => void;
  sessionProgrammeApps: string[];
};
const SchoolCtx = createContext<Ctx | null>(null);
export const keyOf = (talentId: string, skill: string) => `${talentId}:${skill}`;

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [decisions, setDecisions] = useState<Record<string, "verified" | "declined">>({});
  const [added, setAdded] = useState<Facilitator[]>([]);
  const [sessionSkills, setSessionSkills] = useState<Skill[]>([]);
  const [apps, setApps] = useState<string[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage and clock, read once after mount */
    try {
      setDecisions(JSON.parse(sessionStorage.getItem(VERIFY_STORE) ?? "{}"));
      setAdded(JSON.parse(sessionStorage.getItem(FAC_STORE) ?? "[]"));
    } catch {}
    setSessionSkills(readSession<Skill>("bridge-added-skills"));
    setApps(readSession<{ programmeId: string }>("bridge-applications").map((a) => a.programmeId));
    setToday(todayInKigali());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const decide = useCallback((r: Request, d: "verified" | "declined") => {
    if (d === "verified" && r.talentId === "sample-1") addNotice("student", noticeText.skillVerified.replace("{skill}", r.skill).replace("{school}", school.name));
    setDecisions((s) => {
      const next = { ...s, [keyOf(r.talentId, r.skill)]: d };
      try {
        sessionStorage.setItem(VERIFY_STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  const addFacilitator = useCallback((f: Facilitator) => {
    setAdded((s) => {
      const next = [...s, f];
      try {
        sessionStorage.setItem(FAC_STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(() => {
    // The student's pending skills (sample data + added this session) become requests.
    const fromStudent: Request[] = [
      ...studentSkills.filter((s) => !s.verified).map((s) => ({ id: `st-${s.name}`, talentId: "sample-1", skill: s.name, evidence: s.evidence, daysAgo: 4 })),
      ...sessionSkills.map((s) => ({ id: `ss-${s.name}`, talentId: "sample-1", skill: s.name, evidence: s.evidence, daysAgo: 0, fromSession: true })),
    ];
    return {
      ready,
      today,
      requests: [...fromStudent.filter((r) => r.fromSession), ...verificationRequests, ...fromStudent.filter((r) => !r.fromSession)],
      decisions,
      decide,
      facilitators: [...sampleFacilitators, ...added],
      addFacilitator,
      sessionProgrammeApps: apps,
    };
  }, [ready, today, sessionSkills, decisions, decide, added, addFacilitator, apps]);

  return <SchoolCtx.Provider value={value}>{children}</SchoolCtx.Provider>;
}

function useSchool() {
  const c = useContext(SchoolCtx);
  if (!c) throw new Error("useSchool must be used inside SchoolDataProvider");
  return c;
}

const avg = (ids: string[]) => Math.round(ids.reduce((s, id) => s + (learnerProgress[id] ?? 0), 0) / ids.length);
const placementLook: Record<PlacementStatus, string> = {
  applied: "border border-navy-900 text-navy-900",
  "in-placement": "bg-green-50 text-green-700",
  completed: "bg-green-700 text-white",
};
const pendingOf = (requests: Request[], decisions: Ctx["decisions"]) => requests.filter((r) => !decisions[keyOf(r.talentId, r.skill)]);

// ---------- Overview ----------

export function SchoolWelcomeLine() {
  const { requests, decisions, ready } = useSchool();
  if (!ready) return <span>&nbsp;</span>;
  return <>{t.welcomeLine.replace("{learners}", String(talentProfiles.length)).replace("{pending}", String(pendingOf(requests, decisions).length))}</>;
}

export function ClassesPanel({ href }: { href: string }) {
  return (
    <Panel title={t.classes.title} subtitle={t.classes.subtitle} id="classes-title" action={<Button href={href} variant="text">{t.classes.viewAll}</Button>}>
      <ul className="grid gap-4 sm:grid-cols-2 min-[87.5rem]:grid-cols-3">
        {classes.map((c, i) => (
          <li key={c.id}>
            <ColorTile
              index={i}
              big={`${avg(c.learnerIds)}%`}
              chip={c.level}
              title={c.name}
              detail={c.learnerIds.length === 1 ? t.classes.learnerOne : t.classes.learners.replace("{n}", String(c.learnerIds.length))}
            >
              <ProgressBar label={`${c.name}: ${t.students.progressLabel}`} value={avg(c.learnerIds)} hideLabel />
            </ColorTile>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SchoolSnapshot({ href }: { href: string }) {
  const { decisions } = useSchool();
  const s = t.snapshot;
  const verified =
    studentSkills.filter((x) => x.verified && x.verifiedBy === school.name).length +
    talentProfiles.filter((p) => p.id !== "sample-1" && p.verification === "verified").reduce((n, p) => n + p.skills.length, 0) +
    Object.values(decisions).filter((d) => d === "verified").length;
  return (
    <SummaryPanel
      id="school-snapshot"
      title={s.title}
      subtitle={s.subtitle}
      href={href}
      hrefLabel={s.open}
      cardLabel={s.cardLabel}
      bigLabel={s.verifiedLabel}
      big={verified}
      unit={s.unit}
      footer={school.name}
      stats={[
        { icon: Users, value: talentProfiles.length, label: s.stats.learners },
        { icon: Briefcase, value: placements.filter((p) => p.status !== "applied").length, label: s.stats.placed },
        { icon: BookOpen, value: Object.keys(programmeParticipation).length, label: s.stats.programmes },
      ]}
    />
  );
}

export function VerificationPanel({ limit }: { limit?: number }) {
  const { requests, decisions, decide, ready } = useSchool();
  const v = t.verify;
  const [openId, setOpenId] = useState<string | null>(null);
  const [result, setResult] = useState<"verified" | "declined" | null>(null);
  const pending = pendingOf(requests, decisions);
  const shown = limit ? pending.slice(0, limit) : pending;
  const current = requests.find((r) => r.id === openId);
  if (!ready) return <div className="min-h-40 rounded-panel bg-white" />;
  return (
    <Panel title={v.title} subtitle={v.subtitle} id="verify-title">
      {shown.length === 0 ? (
        <EmptyState icon={ShieldCheck} title={v.empty.title} body={v.empty.body} />
      ) : (
        <ul className="space-y-1">
          {shown.map((r) => {
            const p = byId(r.talentId);
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-4 rounded-tile px-3 py-3 hover:bg-gray-50">
                <span aria-hidden className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white">
                  {p.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <div className="min-w-40 flex-1">
                  <p className="font-semibold text-navy-900">
                    {r.skill} · {p.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    {r.evidence ? v.evidence.replace("{e}", r.evidence) : v.noEvidence} · {r.fromSession ? v.fromSession : ago(r.daysAgo)}
                  </p>
                </div>
                <Button variant="navy" shape="pill" onClick={() => { setOpenId(r.id); setResult(null); }}>
                  {v.review}
                  <span className="sr-only">: {r.skill}, {p.name}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current ? `${current.skill} · ${byId(current.talentId).name}` : ""}>
        {current && (
          <div className="space-y-5">
            <p className="text-gray-800">{current.evidence ? v.evidence.replace("{e}", current.evidence) : v.noEvidence}</p>
            <p className="rounded-tile bg-gray-50 p-3 text-sm text-gray-700">{v.note}</p>
            {result ? (
              <p role="status" className="flex items-start gap-2 rounded-tile bg-green-50 p-4 text-gray-800">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" /> {result === "verified" ? v.approved : v.declined}
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button shape="pill" onClick={() => { decide(current, "verified"); setResult("verified"); }}>
                  <BadgeCheck aria-hidden className="size-5" /> {v.approve}
                </Button>
                <Button variant="outline" shape="pill" onClick={() => { decide(current, "declined"); setResult("declined"); }}>
                  {v.decline}
                </Button>
              </div>
            )}
            <TalentCard profile={byId(current.talentId)} />
          </div>
        )}
      </DetailDrawer>
    </Panel>
  );
}

export function SchoolToday({ firstName, studentsHref, placementsHref, programmesHref }: { firstName: string; studentsHref: string; placementsHref: string; programmesHref: string }) {
  const { requests, decisions, today } = useSchool();
  const d = t.today;
  const n = pendingOf(requests, decisions).length;
  const open = today ? programmes.filter((p) => programmeStatus(p, today) === "open") : [];
  const inPlacement = placements.filter((p) => p.status === "in-placement");
  return (
    <TodayTabs
      id="stoday"
      title={d.title.replace("{name}", firstName)}
      tabs={[
        {
          key: "verify",
          label: d.tabs.verify,
          icon: ShieldCheck,
          content: (
            <>
              <h3 className="text-h3 text-navy-900">{t.verify.title}</h3>
              <p className="mt-1 text-gray-700">{n === 0 ? d.verifyNone : n === 1 ? d.verifyOne : d.verifyBody.replace("{n}", String(n))}</p>
              <div className="mt-5">
                <Button href={studentsHref} variant="outline" shape="pill">{d.verifyAction}</Button>
              </div>
            </>
          ),
        },
        {
          key: "placements",
          label: d.tabs.placements,
          icon: Briefcase,
          content: (
            <>
              <h3 className="text-h3 text-navy-900">{d.placementsTitle}</h3>
              <ul className="mt-3 space-y-3">
                {inPlacement.map((p) => (
                  <li key={p.id} className="rounded-tile bg-green-50 p-4">
                    <p className="font-bold text-navy-900">{byId(p.talentId).name} · {p.company}</p>
                    <p className="text-gray-700">{p.role} · {p.period}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button href={placementsHref} variant="outline" shape="pill">{d.placementsAction}</Button>
              </div>
            </>
          ),
        },
        {
          key: "programmes",
          label: d.tabs.programmes,
          icon: GraduationCap,
          content: (
            <>
              <h3 className="text-h3 text-navy-900">{d.programmesTitle}</h3>
              {open.length === 0 ? (
                <p className="mt-1 text-gray-700">{d.programmesNone}</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {open.map((p) => (
                    <li key={p.id} className="rounded-tile bg-green-50 p-4">
                      <p className="font-bold text-navy-900">{p.name}</p>
                      <p className="text-gray-700">{formatDate(p.closesOn)}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5">
                <Button href={programmesHref} variant="outline" shape="pill">{d.programmesAction}</Button>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}

// ---------- Students ----------

export function StudentsView() {
  const s = t.students;
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const classOf = (id: string) => classes.find((c) => c.learnerIds.includes(id));
  const query = q.trim().toLowerCase();
  const shown = talentProfiles.filter(
    (p) => (!cls || classOf(p.id)?.id === cls) && (!query || p.name.toLowerCase().includes(query) || p.skills.some((x) => x.toLowerCase().includes(query))),
  );
  const current = openId ? byId(openId) : null;
  const field = `mt-2 block w-full rounded-full border border-gray-500 bg-white px-4 py-2.5 text-gray-800 ${ring}`;
  return (
    <section aria-label={s.title} className="rounded-panel bg-white p-5 md:p-8">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="block font-semibold text-navy-900">
          {s.search}
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.searchPlaceholder} className={field} />
        </label>
        <label className="block font-semibold text-navy-900">
          {s.classLabel}
          <select value={cls} onChange={(e) => setCls(e.target.value)} className={field}>
            <option value="">{s.allClasses}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.level}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-6">
        <DataTable
          caption={s.title}
          columns={[
            { key: "name", header: s.columns.name },
            { key: "class", header: s.columns.class },
            { key: "progress", header: s.columns.progress, className: "w-48" },
            { key: "verification", header: s.columns.verification },
            { key: "placement", header: s.columns.placement },
            { key: "action", header: "", className: "text-right" },
          ]}
          rows={shown.map((p) => {
            const pl = placements.find((x) => x.talentId === p.id);
            const c = classOf(p.id);
            return {
              key: p.id,
              cells: {
                name: p.name,
                class: c ? `${c.name} · ${c.level}` : "",
                progress: <ProgressBar label={`${p.name}: ${s.progressLabel}`} value={learnerProgress[p.id] ?? 0} hideLabel />,
                verification:
                  p.verification === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-green-700"><BadgeCheck aria-hidden className="size-4" /> {talentCardText.verified}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-gray-700"><Clock aria-hidden className="size-4" /> {talentCardText.inProgress}</span>
                  ),
                placement: pl ? <Pill label={t.placements.status[pl.status]} look={placementLook[pl.status]} /> : <span className="text-gray-500">{s.noPlacement}</span>,
                action: (
                  <button type="button" onClick={() => setOpenId(p.id)} className={`rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline ${ring}`}>
                    {t.verify.review}
                    <span className="sr-only">: {p.name}</span>
                  </button>
                ),
              },
            };
          })}
        />
      </div>
      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current?.name ?? ""}>
        {current && (
          <div className="space-y-5">
            <ProgressBar label={s.progressLabel} value={learnerProgress[current.id] ?? 0} />
            <TalentCard profile={current} />
          </div>
        )}
      </DetailDrawer>
    </section>
  );
}

// ---------- Programmes ----------

export function SchoolProgrammesView() {
  const { today, sessionProgrammeApps, ready } = useSchool();
  const p = t.programmes;
  if (!ready) return <div className="min-h-40 rounded-panel bg-white" />;
  return (
    <section aria-label={p.title} className="rounded-panel bg-white p-5 md:p-8">
      <DataTable
        caption={p.title}
        columns={[
          { key: "name", header: p.columns.name },
          { key: "status", header: p.columns.status },
          { key: "learners", header: p.columns.learners },
          { key: "dates", header: p.columns.dates },
        ]}
        rows={programmes.map((x) => {
          const status: ProgrammeStatus = programmeStatus(x, today);
          return {
            key: x.id,
            cells: {
              name: x.name,
              status: <StatusPill status={status} />,
              learners: (
                <span>
                  {programmeParticipation[x.id] ?? 0}
                  {sessionProgrammeApps.includes(x.id) && <span className="ml-2 text-sm font-semibold text-green-700">{p.sessionApplied}</span>}
                </span>
              ),
              dates: p.datesRange.replace("{opens}", formatDate(x.opensOn)).replace("{closes}", formatDate(x.closesOn)),
            },
          };
        })}
      />
      <p className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <Info aria-hidden className="size-4" /> {p.sample}
      </p>
    </section>
  );
}

// ---------- Placements ----------

export function PlacementsView() {
  const p = t.placements;
  return (
    <section aria-label={p.title} className="rounded-panel bg-white p-5 md:p-8">
      <DataTable
        caption={p.title}
        columns={[
          { key: "learner", header: p.columns.learner },
          { key: "company", header: p.columns.company },
          { key: "role", header: p.columns.role },
          { key: "status", header: p.columns.status },
          { key: "period", header: p.columns.period },
        ]}
        rows={placements.map((x) => ({
          key: x.id,
          cells: {
            learner: byId(x.talentId).name,
            company: x.company,
            role: x.role,
            status: <Pill label={p.status[x.status]} look={placementLook[x.status]} />,
            period: x.period,
          },
        }))}
      />
      <p className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <Info aria-hidden className="size-4" /> {p.note}
      </p>
    </section>
  );
}

// ---------- Institution profile ----------

export function InstitutionProfileView() {
  const { facilitators, addFacilitator } = useSchool();
  const p = t.profile;
  const f = p.form;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [v, setV] = useState({ name: "", subject: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!v.name.trim()) er["fac-name"] = formText.required;
    if (!v.subject.trim()) er["fac-subject"] = formText.required;
    if (!v.email.trim()) er["fac-email"] = formText.required;
    else if (!isEmail(v.email)) er["fac-email"] = formText.email;
    setErrors(er);
    if (Object.keys(er).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    addFacilitator({ id: `f-${Date.now()}`, name: v.name.trim(), subject: v.subject.trim(), email: v.email.trim() });
    setV({ name: "", subject: "", email: "" });
    setDone(true);
    dialogRef.current?.close();
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[24rem_1fr]">
      <Panel title={p.details} id="details-title">
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-navy-900">{p.location}</dt>
            <dd className="text-gray-700">{school.location}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy-900">{p.type}</dt>
            <dd className="text-gray-700">{school.type}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy-900">{p.disciplines}</dt>
            <dd>
              <ul className="mt-2 flex flex-wrap gap-2">
                {school.disciplines.map((d) => (
                  <li key={d} className="rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-navy-900">{d}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </Panel>
      <Panel
        title={p.facilitators}
        id="fac-title"
        action={
          <Button shape="pill" onClick={() => dialogRef.current?.showModal()}>
            <UserPlus aria-hidden className="size-5" /> {p.addFacilitator}
          </Button>
        }
      >
        {done && <p role="status" className="mb-4 rounded-tile bg-green-50 p-4 text-gray-800">{sharedText.saved}</p>}
        <ul className="grid gap-3 md:grid-cols-2">
          {facilitators.map((x) => (
            <li key={x.id} className="flex items-center gap-3 rounded-tile bg-gray-50 p-4">
              <span aria-hidden className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-green-700 font-bold text-white">
                {x.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{x.name}</p>
                <p className="text-sm text-gray-700">{x.subject}</p>
                <p className="truncate text-sm text-gray-700">{x.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <dialog
        ref={dialogRef}
        aria-labelledby="fac-form-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-panel bg-white p-0 backdrop:bg-navy-900/60"
      >
        <form noValidate onSubmit={submit} className="space-y-5 p-6">
          <h2 id="fac-form-title" className="text-h3 text-navy-900">{f.title}</h2>
          <ErrorSummary title={formText.errorSummaryTitle} errors={errors} labels={{ "fac-name": f.name, "fac-subject": f.subject, "fac-email": f.email }} summaryRef={summaryRef} />
          <TextField id="fac-name" label={f.name} required value={v.name} onChange={(x) => setV({ ...v, name: x })} error={errors["fac-name"]} />
          <TextField id="fac-subject" label={f.subject} required value={v.subject} onChange={(x) => setV({ ...v, subject: x })} error={errors["fac-subject"]} />
          <TextField id="fac-email" type="email" label={f.email} required value={v.email} onChange={(x) => setV({ ...v, email: x })} error={errors["fac-email"]} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" shape="pill" onClick={() => dialogRef.current?.close()}>{f.cancel}</Button>
            <Button type="submit" shape="pill">{f.submit}</Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
