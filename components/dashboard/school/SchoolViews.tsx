"use client";

import Link from "next/link";
import { BadgeCheck, Briefcase, CheckCircle2, Clock, GraduationCap, Info, ShieldCheck, UserPlus } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { StatusPill } from "@/components/StatusPill";
import { TalentCard } from "@/components/TalentCard";
import { DataGrid, SortHeader, type ColumnDef } from "@/components/dashboard/DataGrid";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { ago, InitialsAvatar, SummaryPanel, TodayAction, TodayItem, TodayTabs, TodayText, ToolbarSelect } from "@/components/dashboard/kit";
import { EmptyState, Panel, ProgressBar } from "@/components/dashboard/parts";
import { ErrorSummary, TextField } from "@/components/forms/Fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { noticeText, schoolText as t, sharedText } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { talentCardText } from "@/content/ui";
import { learnerProgress } from "@/data/dashboard";
import { programmes, type Programme } from "@/data/programmes";
import {
  classes, facilitators as sampleFacilitators, placements, programmeParticipation, school, verificationRequests, type Facilitator, type Placement, type PlacementStatus, type VerificationRequest,
} from "@/data/school";
import { skills as studentSkills, type Skill } from "@/data/student";
import { talentProfiles, type TalentProfile } from "@/data/talent";
import { formatDate, programmeStatus, todayInKigali, type ProgrammeStatus } from "@/lib/programmes";
import { addNotice, isEmail, readSession, VERIFY_STORE } from "@/lib/prototypeStore";

/*
  School dashboard (redesign Step 7, on shadcn/ui).
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
const placementVariant = { applied: "upcoming", "in-placement": "secondary", completed: "default" } as const;
const PlacementBadge = ({ status }: { status: PlacementStatus }) => <Badge variant={placementVariant[status]}>{t.placements.status[status]}</Badge>;
const pendingOf = (requests: Request[], decisions: Ctx["decisions"]) => requests.filter((r) => !decisions[keyOf(r.talentId, r.skill)]);
const ANY = "any";
const sortHeader = (label: string) =>
  function Header({ column }: { column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc?: boolean) => void } }) {
    return <SortHeader label={label} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />;
  };

// ---------- Overview ----------

export function SchoolWelcomeLine() {
  const { requests, decisions, ready } = useSchool();
  if (!ready) return <span>&nbsp;</span>;
  return <>{t.welcomeLine.replace("{learners}", String(talentProfiles.length)).replace("{pending}", String(pendingOf(requests, decisions).length))}</>;
}

export function ClassesPanel({ href }: { href: string }) {
  return (
    <Panel
      title={t.classes.title}
      subtitle={t.classes.subtitle}
      id="classes-title"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href={href}>{t.classes.viewAll}</Link>
        </Button>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {classes.map((c) => {
          const pct = avg(c.learnerIds);
          return (
            <li key={c.id}>
              <article className="flex h-full flex-col gap-4 rounded-xl bg-card p-4 text-sm shadow-xs ring-1 ring-border">
                <div className="flex items-start justify-between gap-3">
                  <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <GraduationCap className="size-5" />
                  </span>
                  <Badge variant="outline">{c.level}</Badge>
                </div>
                <div>
                  <h3 className="font-heading text-base leading-snug font-semibold text-heading">{c.name}</h3>
                  <p className="mt-0.5 text-muted-foreground">
                    {c.learnerIds.length === 1 ? t.classes.learnerOne : t.classes.learners.replace("{n}", String(c.learnerIds.length))}
                  </p>
                </div>
                <div className="mt-auto space-y-2">
                  <Progress value={pct} aria-label={`${c.name}: ${t.students.progressLabel}`} />
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>{t.students.progressLabel}</span>
                    <span className="font-medium text-heading tabular-nums">{pct}%</span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
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
        { value: talentProfiles.length, label: s.stats.learners },
        { value: placements.filter((p) => p.status !== "applied").length, label: s.stats.placed },
        { value: Object.keys(programmeParticipation).length, label: s.stats.programmes },
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
  if (!ready) return <Skeleton className="h-48 w-full rounded-xl" />;
  const choose = (r: Request, d: "verified" | "declined") => {
    decide(r, d);
    setResult(d);
    toast.success(d === "verified" ? v.approved : v.declined);
  };
  return (
    <Panel title={v.title} subtitle={v.subtitle} id="verify-title">
      {shown.length === 0 ? (
        <EmptyState icon={ShieldCheck} title={v.empty.title} body={v.empty.body} />
      ) : (
        <ul className="divide-y rounded-lg border">
          {shown.map((r) => {
            const p = byId(r.talentId);
            return (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <InitialsAvatar name={p.name} />
                <div className="min-w-40 flex-1">
                  <p className="font-medium text-heading">
                    {r.skill} · {p.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.evidence ? v.evidence.replace("{e}", r.evidence) : v.noEvidence} · {r.fromSession ? v.fromSession : ago(r.daysAgo)}
                  </p>
                </div>
                <Button
                  variant="navy"
                  size="sm"
                  onClick={() => {
                    setOpenId(r.id);
                    setResult(null);
                  }}
                >
                  {v.review}
                  <span className="sr-only">
                    : {r.skill}, {p.name}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current ? `${current.skill} · ${byId(current.talentId).name}` : ""}>
        {current && (
          <div className="space-y-5 text-sm">
            <p>{current.evidence ? v.evidence.replace("{e}", current.evidence) : v.noEvidence}</p>
            <Alert>
              <Info aria-hidden />
              <AlertDescription>{v.note}</AlertDescription>
            </Alert>
            {result ? (
              <Alert variant="success" role="status">
                <CheckCircle2 aria-hidden />
                <AlertDescription>{result === "verified" ? v.approved : v.declined}</AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => choose(current, "verified")}>
                  <BadgeCheck data-icon="inline-start" aria-hidden /> {v.approve}
                </Button>
                <Button variant="outline" onClick={() => choose(current, "declined")}>
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
              <TodayText title={t.verify.title} body={n === 0 ? d.verifyNone : n === 1 ? d.verifyOne : d.verifyBody.replace("{n}", String(n))} />
              <TodayAction href={studentsHref} label={d.verifyAction} />
            </>
          ),
        },
        {
          key: "placements",
          label: d.tabs.placements,
          icon: Briefcase,
          content: (
            <>
              <TodayText title={d.placementsTitle} />
              <ul className="space-y-2">
                {inPlacement.map((p) => (
                  <li key={p.id}>
                    <TodayItem icon={Briefcase} title={`${byId(p.talentId).name} · ${p.company}`} detail={`${p.role} · ${p.period}`} />
                  </li>
                ))}
              </ul>
              <TodayAction href={placementsHref} label={d.placementsAction} />
            </>
          ),
        },
        {
          key: "programmes",
          label: d.tabs.programmes,
          icon: GraduationCap,
          content: (
            <>
              <TodayText title={d.programmesTitle} body={open.length === 0 ? d.programmesNone : undefined} />
              {open.length > 0 && (
                <ul className="space-y-2">
                  {open.map((p) => (
                    <li key={p.id}>
                      <TodayItem icon={GraduationCap} title={p.name} detail={formatDate(p.closesOn)} />
                    </li>
                  ))}
                </ul>
              )}
              <TodayAction href={programmesHref} label={d.programmesAction} />
            </>
          ),
        },
      ]}
    />
  );
}

// ---------- Students ----------

type StudentRow = TalentProfile & { className: string; classId: string; progress: number; placement?: Placement };

export function StudentsView() {
  const s = t.students;
  const [cls, setCls] = useState(ANY);
  const [openId, setOpenId] = useState<string | null>(null);
  const rows: StudentRow[] = talentProfiles
    .map((p) => {
      const c = classes.find((x) => x.learnerIds.includes(p.id));
      return { ...p, className: c ? `${c.name} · ${c.level}` : "", classId: c?.id ?? "", progress: learnerProgress[p.id] ?? 0, placement: placements.find((x) => x.talentId === p.id) };
    })
    .filter((p) => cls === ANY || p.classId === cls);
  const current = openId ? byId(openId) : null;

  const columns = useMemo<ColumnDef<StudentRow, unknown>[]>(
    () => [
      {
        id: "name",
        accessorFn: (r) => `${r.name} ${r.skills.join(" ")}`,
        header: s.columns.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <InitialsAvatar name={row.original.name} />
            <span className="font-medium text-heading">{row.original.name}</span>
          </div>
        ),
      },
      { accessorKey: "className", header: s.columns.class, enableGlobalFilter: false },
      {
        accessorKey: "progress",
        header: sortHeader(s.columns.progress),
        cell: ({ row }) => (
          <div className="w-40">
            <ProgressBar label={`${row.original.name}: ${s.progressLabel}`} value={row.original.progress} hideLabel />
          </div>
        ),
        enableGlobalFilter: false,
      },
      {
        accessorKey: "verification",
        header: s.columns.verification,
        cell: ({ row }) =>
          row.original.verification === "verified" ? (
            <Badge variant="verified">
              <BadgeCheck data-icon="inline-start" aria-hidden /> {talentCardText.verified}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <Clock data-icon="inline-start" aria-hidden /> {talentCardText.inProgress}
            </Badge>
          ),
        enableGlobalFilter: false,
      },
      {
        id: "placement",
        header: s.columns.placement,
        cell: ({ row }) => (row.original.placement ? <PlacementBadge status={row.original.placement.status} /> : <span className="text-muted-foreground">{s.noPlacement}</span>),
      },
      {
        id: "action",
        header: () => <span className="sr-only">{t.verify.review}</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => setOpenId(row.original.id)}>
              {t.verify.review}
              <span className="sr-only">: {row.original.name}</span>
            </Button>
          </div>
        ),
      },
    ],
    [s],
  );

  return (
    <>
      <DataGrid
        data={rows}
        columns={columns}
        caption={s.title}
        searchLabel={s.search}
        searchPlaceholder={s.searchPlaceholder}
        toolbar={
          <ToolbarSelect
            label={s.classLabel}
            value={cls}
            onChange={setCls}
            className="sm:w-60"
            options={[{ value: ANY, label: s.allClasses }, ...classes.map((c) => ({ value: c.id, label: `${c.name} · ${c.level}` }))]}
          />
        }
      />
      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current?.name ?? ""}>
        {current && (
          <div className="space-y-5">
            <ProgressBar label={s.progressLabel} value={learnerProgress[current.id] ?? 0} />
            <TalentCard profile={current} />
          </div>
        )}
      </DetailDrawer>
    </>
  );
}

// ---------- Programmes ----------

type ProgrammeRow = Programme & { status: ProgrammeStatus; learners: number };

export function SchoolProgrammesView() {
  const { today, sessionProgrammeApps, ready } = useSchool();
  const p = t.programmes;
  const columns = useMemo<ColumnDef<ProgrammeRow, unknown>[]>(
    () => [
      { accessorKey: "name", header: p.columns.name, cell: ({ row }) => <span className="font-medium text-heading">{row.original.name}</span> },
      { accessorKey: "status", header: p.columns.status, cell: ({ row }) => <StatusPill status={row.original.status} /> },
      {
        accessorKey: "learners",
        header: sortHeader(p.columns.learners),
        cell: ({ row }) => (
          <span className="inline-flex flex-wrap items-center gap-2 tabular-nums">
            {row.original.learners}
            {sessionProgrammeApps.includes(row.original.id) && <Badge variant="secondary">{p.sessionApplied}</Badge>}
          </span>
        ),
      },
      { id: "dates", header: p.columns.dates, cell: ({ row }) => p.datesRange.replace("{opens}", formatDate(row.original.opensOn)).replace("{closes}", formatDate(row.original.closesOn)) },
    ],
    [p, sessionProgrammeApps],
  );
  if (!ready) return <Skeleton className="h-48 w-full rounded-xl" />;
  const rows = programmes.map((x) => ({ ...x, status: programmeStatus(x, today), learners: programmeParticipation[x.id] ?? 0 }));
  return (
    <div className="space-y-3">
      <DataGrid data={rows} columns={columns} caption={p.title} />
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Info aria-hidden className="size-4" /> {p.sample}
      </p>
    </div>
  );
}

// ---------- Placements ----------

type PlacementRow = Placement & { learner: string };

export function PlacementsView() {
  const p = t.placements;
  const [status, setStatus] = useState(ANY);
  const rows: PlacementRow[] = placements.filter((x) => status === ANY || x.status === status).map((x) => ({ ...x, learner: byId(x.talentId).name }));
  const columns = useMemo<ColumnDef<PlacementRow, unknown>[]>(
    () => [
      {
        accessorKey: "learner",
        header: p.columns.learner,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <InitialsAvatar name={row.original.learner} />
            <span className="font-medium text-heading">{row.original.learner}</span>
          </div>
        ),
      },
      { accessorKey: "company", header: p.columns.company },
      { accessorKey: "role", header: p.columns.role },
      { accessorKey: "status", header: p.columns.status, cell: ({ row }) => <PlacementBadge status={row.original.status} />, enableGlobalFilter: false },
      { accessorKey: "period", header: p.columns.period, enableGlobalFilter: false },
    ],
    [p],
  );
  return (
    <div className="space-y-3">
      <DataGrid
        data={rows}
        columns={columns}
        caption={p.title}
        searchLabel={p.searchLabel}
        searchPlaceholder={p.searchLabel}
        toolbar={
          <ToolbarSelect
            label={p.columns.status}
            value={status}
            onChange={setStatus}
            options={[{ value: ANY, label: p.allStatuses }, ...(Object.keys(p.status) as PlacementStatus[]).map((k) => ({ value: k, label: p.status[k] }))]}
          />
        }
      />
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Info aria-hidden className="size-4" /> {p.note}
      </p>
    </div>
  );
}

// ---------- Institution profile ----------

export function InstitutionProfileView() {
  const { facilitators, addFacilitator } = useSchool();
  const p = t.profile;
  const f = p.form;
  const summaryRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ name: "", subject: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setOpen(false);
    toast.success(sharedText.saved);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <Panel title={p.details} id="details-title">
        <dl className="divide-y text-sm">
          <div className="pb-3">
            <dt className="text-xs text-muted-foreground">{p.location}</dt>
            <dd className="mt-0.5 font-medium text-heading">{school.location}</dd>
          </div>
          <div className="py-3">
            <dt className="text-xs text-muted-foreground">{p.type}</dt>
            <dd className="mt-0.5 font-medium text-heading">{school.type}</dd>
          </div>
          <div className="pt-3">
            <dt className="text-xs text-muted-foreground">{p.disciplines}</dt>
            <dd>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {school.disciplines.map((d) => (
                  <li key={d}>
                    <Badge variant="outline">{d}</Badge>
                  </li>
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
          <Button size="sm" onClick={() => setOpen(true)}>
            <UserPlus data-icon="inline-start" aria-hidden /> {p.addFacilitator}
          </Button>
        }
      >
        <ul className="grid gap-2 md:grid-cols-2">
          {facilitators.map((x) => (
            <li key={x.id}>
              <Item variant="outline" size="sm">
                <ItemMedia>
                  <InitialsAvatar name={x.name} />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle className="text-heading">{x.name}</ItemTitle>
                  <ItemDescription>{x.subject}</ItemDescription>
                  <ItemDescription className="truncate">{x.email}</ItemDescription>
                </ItemContent>
              </Item>
            </li>
          ))}
        </ul>
      </Panel>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form noValidate onSubmit={submit} className="grid gap-5">
            <DialogHeader>
              <DialogTitle>{f.title}</DialogTitle>
            </DialogHeader>
            <ErrorSummary title={formText.errorSummaryTitle} errors={errors} labels={{ "fac-name": f.name, "fac-subject": f.subject, "fac-email": f.email }} summaryRef={summaryRef} />
            <TextField id="fac-name" label={f.name} required value={v.name} onChange={(x) => setV({ ...v, name: x })} error={errors["fac-name"]} />
            <TextField id="fac-subject" label={f.subject} required value={v.subject} onChange={(x) => setV({ ...v, subject: x })} error={errors["fac-subject"]} />
            <TextField id="fac-email" type="email" label={f.email} required value={v.email} onChange={(x) => setV({ ...v, email: x })} error={errors["fac-email"]} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {f.cancel}
              </Button>
              <Button type="submit">{f.submit}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
