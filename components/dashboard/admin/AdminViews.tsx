"use client";

import Link from "next/link";
import { CheckCircle2, Info, Plus } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { StatusPill } from "@/components/StatusPill";
import { DataGrid, SortHeader, type ColumnDef } from "@/components/dashboard/DataGrid";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { ago, InitialsAvatar, SummaryPanel, TodayAction, TodayTabs, TodayText, ToolbarSelect } from "@/components/dashboard/kit";
import { Panel } from "@/components/dashboard/parts";
import { ErrorSummary, TextArea, TextField } from "@/components/forms/Fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { adminText as t, sharedText } from "@/content/dashboard";
import { footer, trust } from "@/content/home";
import { formText } from "@/content/pages";
import { extraUsers, type UserRow } from "@/data/admin";
import { articles } from "@/data/articles";
import { company } from "@/data/company";
import { programmes as samplePrograms, type Programme } from "@/data/programmes";
import { school } from "@/data/school";
import { talentProfiles } from "@/data/talent";
import { sampleUsers } from "@/data/users";
import { formatDate, programmeStatus, todayInKigali, type ProgrammeStatus } from "@/lib/programmes";
import { APPROVAL_STORE, PROGRAMME_EDITS_STORE, readSession } from "@/lib/prototypeStore";

/*
  Admin dashboard (redesign Step 7, on shadcn/ui).
  Programme status is always calculated from the dates (CLAUDE.md, component 8).
  Changes are kept in this browser tab and show on the public site in the same tab.
*/

const PROG_STORE = PROGRAMME_EDITS_STORE;

type Decision = "approved" | "changes";
type ApprovalItem = { key: string; label: string; type: keyof typeof t.content.types };

function approvalItems(): ApprovalItem[] {
  return [
    ...trust.stats.filter((s) => !s.approved).map((s) => ({ key: `stat:${s.value}`, label: `${s.value} ${s.label}`, type: "stat" as const })),
    ...samplePrograms.filter((p) => !p.approved).map((p) => ({ key: `programme:${p.id}`, label: p.name, type: "programme" as const })),
    ...articles.filter((a) => !a.approved).map((a) => ({ key: `article:${a.id}`, label: a.title, type: "article" as const })),
    ...(footer.contact && !footer.contact.approved ? [{ key: "contact:footer", label: footer.contact.email ?? "", type: "contact" as const }] : []),
  ];
}

type Ctx = {
  ready: boolean;
  today: string;
  programmes: Programme[];
  saveProgramme: (p: Programme) => void;
  items: ApprovalItem[];
  decisions: Record<string, Decision>;
  decide: (key: string, d: Decision) => void;
  users: UserRow[];
  sessionApps: string[];
};
const AdminCtx = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [edited, setEdited] = useState<Record<string, Programme>>({});
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [sessionApps, setSessionApps] = useState<string[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage and clock, read once after mount */
    setEdited(load(PROG_STORE, {}));
    setDecisions(load(APPROVAL_STORE, {}));
    setToday(todayInKigali());
    setSessionApps(readSession<{ programmeId: string }>("bridge-applications").map((a) => a.programmeId));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const saveProgramme = useCallback((p: Programme) => {
    setEdited((s) => {
      const next = { ...s, [p.id]: p };
      try {
        sessionStorage.setItem(PROG_STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  const decide = useCallback((key: string, d: Decision) => {
    setDecisions((s) => {
      const next = { ...s, [key]: d };
      try {
        sessionStorage.setItem(APPROVAL_STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(() => {
    const created = Object.values(edited).filter((p) => !samplePrograms.some((s) => s.id === p.id));
    const users: UserRow[] = [
      ...talentProfiles.map((p, i) => ({ id: p.id, name: p.name, role: "Student" as const, organisation: school.name, status: "Active" as const, joinedDaysAgo: 30 + i * 11 })),
      { id: "u-school", name: sampleUsers.school.name, role: "School", organisation: school.name, status: "Active", joinedDaysAgo: 120 },
      { id: "u-company", name: sampleUsers.company.name, role: "Company", organisation: company.name, status: "Active", joinedDaysAgo: 64 },
      { id: "u-admin", name: sampleUsers.admin.name, role: "Admin", organisation: "Bridge", status: "Active", joinedDaysAgo: 200 },
      ...extraUsers,
    ];
    return {
      ready,
      today,
      programmes: [...created, ...samplePrograms.map((p) => edited[p.id] ?? p)],
      saveProgramme,
      items: approvalItems(),
      decisions,
      decide,
      users,
      sessionApps,
    };
  }, [ready, today, edited, saveProgramme, decisions, decide, sessionApps]);

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside AdminDataProvider");
  return c;
}

const pendingCount = (items: ApprovalItem[], d: Record<string, Decision>) => items.filter((i) => !d[i.key]).length;

// ---------- Overview ----------

export function AdminWelcomeLine() {
  const { ready, items, decisions, programmes, today } = useAdmin();
  if (!ready) return <span>&nbsp;</span>;
  const open = programmes.filter((p) => programmeStatus(p, today) === "open").length;
  return <>{(open === 1 ? t.welcomeLineOne : t.welcomeLine).replace("{pending}", String(pendingCount(items, decisions))).replace("{open}", String(open))}</>;
}

export function AdminSnapshot({ href }: { href: string }) {
  const { users, programmes, today, items, decisions, ready } = useAdmin();
  const s = t.snapshot;
  const count = (st: string) => (ready ? programmes.filter((p) => programmeStatus(p, today) === st).length : "–");
  return (
    <SummaryPanel
      id="admin-snapshot"
      title={s.title}
      subtitle={s.subtitle}
      href={href}
      hrefLabel={s.open}
      cardLabel={s.cardLabel}
      bigLabel={s.usersLabel}
      big={users.length}
      unit={s.unit}
      footer="Bridge"
      stats={[
        { value: count("open"), label: s.stats.open },
        { value: count("upcoming"), label: s.stats.upcoming },
        { value: pendingCount(items, decisions), label: s.stats.pending },
      ]}
    />
  );
}

export function AdminToday({ firstName, contentHref, programmesHref, usersHref }: { firstName: string; contentHref: string; programmesHref: string; usersHref: string }) {
  const { items, decisions, programmes, today, users } = useAdmin();
  const d = t.today;
  const pending = pendingCount(items, decisions);
  const open = programmes.filter((p) => today && programmeStatus(p, today) === "open").length;
  const invited = users.filter((u) => u.status === "Invited").length;
  const block = (title: string, body: string, href: string, action: string) => (
    <>
      <TodayText title={title} body={body} />
      <TodayAction href={href} label={action} />
    </>
  );
  return (
    <TodayTabs
      id="atoday"
      title={d.title.replace("{name}", firstName)}
      tabs={[
        { key: "approve", label: d.tabs.approve, content: block(t.content.title, pending ? d.approveBody.replace("{n}", String(pending)) : d.approveNone, contentHref, d.approveAction) },
        { key: "programmes", label: d.tabs.programmes, content: block(t.programmes.title, d.programmesBody.replace("{n}", String(open)), programmesHref, d.programmesAction) },
        { key: "users", label: d.tabs.users, content: block(t.users.title, d.usersBody.replace("{n}", String(invited)), usersHref, d.usersAction) },
      ]}
    />
  );
}

// ---------- Programme manager ----------

type FormV = { name: string; summary: string; opensOn: string; closesOn: string; endsOn: string };
type ProgrammeRow = Programme & { status: ProgrammeStatus; applied: boolean };
const emptyProgramme: FormV = { name: "", summary: "", opensOn: "", closesOn: "", endsOn: "" };

export function ProgrammeManager({ compact = false }: { compact?: boolean }) {
  const { programmes, saveProgramme, today, ready, sessionApps } = useAdmin();
  const p = t.programmes;
  const f = p.form;
  const summaryRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Programme | null>(null);
  const [v, setV] = useState<FormV>(emptyProgramme);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openForm = useCallback((prog: Programme | null) => {
    setEditing(prog);
    setV(prog ? { name: prog.name, summary: prog.summary, opensOn: prog.opensOn, closesOn: prog.closesOn, endsOn: prog.endsOn } : emptyProgramme);
    setErrors({});
    setOpen(true);
  }, []);
  const previewStatus = v.opensOn && v.closesOn && v.endsOn && today ? programmeStatus({ ...(editing ?? samplePrograms[0]), ...v }, today) : null;

  function save(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!v.name.trim()) er["pg-name"] = formText.required;
    if (!v.summary.trim()) er["pg-summary"] = formText.required;
    if (!v.opensOn) er["pg-opens"] = formText.required;
    if (!v.closesOn) er["pg-closes"] = formText.required;
    if (!v.endsOn) er["pg-ends"] = formText.required;
    if (v.opensOn && v.closesOn && v.endsOn && !(v.opensOn <= v.closesOn && v.closesOn <= v.endsOn)) er["pg-closes"] = f.orderError;
    setErrors(er);
    if (Object.keys(er).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const base: Programme = editing ?? {
      id: `new-${Date.now()}`,
      name: "",
      summary: "",
      audience: "TVET students and graduates",
      eligibility: [],
      format: "To be confirmed",
      location: "Kigali, Rwanda",
      opensOn: "",
      closesOn: "",
      endsOn: "",
      approved: false,
    };
    saveProgramme({ ...base, ...v, name: v.name.trim(), summary: v.summary.trim() });
    setOpen(false);
    toast.success(sharedText.saved);
  }

  const columns = useMemo<ColumnDef<ProgrammeRow, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: p.columns.name,
        cell: ({ row }) => (
          <span>
            <span className="block font-medium text-heading">{row.original.name}</span>
            {row.original.applied && (
              <Badge variant="secondary" className="mt-1">
                {p.sessionApplied}
              </Badge>
            )}
          </span>
        ),
      },
      { accessorKey: "status", header: p.columns.status, cell: ({ row }) => <StatusPill status={row.original.status} />, enableGlobalFilter: false },
      {
        accessorKey: "opensOn",
        header: ({ column }) => <SortHeader label={p.columns.opens} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => formatDate(row.original.opensOn),
        enableGlobalFilter: false,
      },
      {
        accessorKey: "closesOn",
        header: ({ column }) => <SortHeader label={p.columns.closes} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => formatDate(row.original.closesOn),
        enableGlobalFilter: false,
      },
      {
        id: "action",
        header: () => <span className="sr-only">{p.edit}</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => openForm(row.original)}>
              {p.edit}
              <span className="sr-only">: {row.original.name}</span>
            </Button>
          </div>
        ),
      },
    ],
    [p, openForm],
  );

  if (!ready) return <Skeleton className="h-48 w-full rounded-xl" />;
  const rows: ProgrammeRow[] = (compact ? programmes.slice(0, 5) : programmes).map((x) => ({ ...x, status: programmeStatus(x, today), applied: sessionApps.includes(x.id) }));
  return (
    <>
      <DataGrid
        data={rows}
        // The overview's narrow column drops "Applications open"; the Programmes page shows every column.
        columns={compact ? columns.filter((c) => (c as { accessorKey?: string }).accessorKey !== "opensOn") : columns}
        caption={p.title}
        searchLabel={compact ? undefined : p.searchLabel}
        searchPlaceholder={p.searchLabel}
        toolbar={
          compact ? undefined : (
            <Button className="sm:ml-auto" onClick={() => openForm(null)}>
              <Plus data-icon="inline-start" aria-hidden /> {t.newProgrammeCta}
            </Button>
          )
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <form noValidate onSubmit={save} className="grid gap-5">
            <DialogHeader>
              <DialogTitle>{editing ? f.editTitle.replace("{name}", editing.name) : f.createTitle}</DialogTitle>
              <DialogDescription className="flex items-start gap-2">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {f.prototype}
              </DialogDescription>
            </DialogHeader>
            <ErrorSummary
              title={formText.errorSummaryTitle}
              errors={errors}
              labels={{ "pg-name": f.name, "pg-summary": f.summary, "pg-opens": f.opensOn, "pg-closes": f.closesOn, "pg-ends": f.endsOn }}
              summaryRef={summaryRef}
            />
            <TextField id="pg-name" label={f.name} required value={v.name} onChange={(x) => setV({ ...v, name: x })} error={errors["pg-name"]} />
            <TextArea id="pg-summary" label={f.summary} required value={v.summary} onChange={(x) => setV({ ...v, summary: x })} error={errors["pg-summary"]} />
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField id="pg-opens" type="date" label={f.opensOn} required value={v.opensOn} onChange={(x) => setV({ ...v, opensOn: x })} error={errors["pg-opens"]} />
              <TextField id="pg-closes" type="date" label={f.closesOn} required value={v.closesOn} onChange={(x) => setV({ ...v, closesOn: x })} error={errors["pg-closes"]} />
              <TextField id="pg-ends" type="date" label={f.endsOn} required value={v.endsOn} onChange={(x) => setV({ ...v, endsOn: x })} error={errors["pg-ends"]} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setV({ ...v, opensOn: today, closesOn: v.closesOn && v.closesOn >= today ? v.closesOn : today })}>
                {f.openNow}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setV({ ...v, closesOn: today, opensOn: v.opensOn && v.opensOn <= today ? v.opensOn : today })}>
                {f.closeNow}
              </Button>
            </div>
            <p aria-live="polite" className="flex min-h-6 items-center gap-2 text-sm font-medium text-heading">
              {previewStatus && (
                <>
                  {f.statusPreview.replace("{status}", "")} <StatusPill status={previewStatus} />
                </>
              )}
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {f.cancel}
              </Button>
              <Button type="submit">{f.save}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------- Content approvals ----------

// Awaiting approval uses the Draft colours, because these are exactly the items shown as Draft on the site.
const decisionVariant = { pending: "draft", approved: "open", changes: "upcoming" } as const;
type ApprovalRow = ApprovalItem & { decision?: Decision };

export function ContentApprovals({ compact = false }: { compact?: boolean }) {
  const { items, decisions, decide, ready } = useAdmin();
  const c = t.content;
  const choose = useCallback(
    (i: ApprovalItem, d: Decision, from: HTMLElement) => {
      // The row's buttons are replaced by a tick, so keep keyboard users moving: focus the next
      // item still waiting for a decision, or the table if none is left.
      const table = from.closest("table");
      const rowIndex = from.closest("tr")?.sectionRowIndex ?? 0;
      decide(i.key, d);
      toast.success((d === "approved" ? c.approvedToast : c.changesToast).replace("{item}", i.label));
      requestAnimationFrame(() => {
        const next = [...(table?.tBodies[0]?.rows ?? [])].slice(rowIndex).map((r) => r.querySelector("button")).find(Boolean);
        (next ?? table?.closest<HTMLElement>("[role=region]"))?.focus();
      });
    },
    [decide, c],
  );
  const columns = useMemo<ColumnDef<ApprovalRow, unknown>[]>(
    () => [
      { accessorKey: "label", header: c.columns.item, cell: ({ row }) => <span className="font-medium text-heading">{row.original.label}</span> },
      { id: "type", accessorFn: (r) => c.types[r.type], header: c.columns.type },
      {
        id: "status",
        header: c.columns.status,
        cell: ({ row }) => <Badge variant={decisionVariant[row.original.decision ?? "pending"]}>{c.status[row.original.decision ?? "pending"]}</Badge>,
      },
      {
        id: "action",
        header: () => <span className="sr-only">{c.approve}</span>,
        cell: ({ row }) =>
          row.original.decision ? (
            <CheckCircle2 aria-hidden className="ml-auto size-5 text-primary" />
          ) : (
            <span className="flex justify-end gap-2">
              <Button variant="navy" size="sm" onClick={(e) => choose(row.original, "approved", e.currentTarget)}>
                {c.approve}
                <span className="sr-only">: {row.original.label}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={(e) => choose(row.original, "changes", e.currentTarget)}>
                {c.requestChanges}
                <span className="sr-only">: {row.original.label}</span>
              </Button>
            </span>
          ),
      },
    ],
    [c, choose],
  );
  if (!ready) return <Skeleton className="h-48 w-full rounded-xl" />;
  const rows: ApprovalRow[] = (compact ? items.filter((i) => !decisions[i.key]).slice(0, 4) : items).map((i) => ({ ...i, decision: decisions[i.key] }));
  return (
    <div className="space-y-3">
      <DataGrid
        data={rows}
        // The overview's narrow column drops "Type"; the Content approvals page shows every column.
        columns={compact ? columns.filter((col) => col.id !== "type") : columns}
        caption={c.title}
        searchLabel={compact ? undefined : c.searchLabel}
        searchPlaceholder={c.searchLabel}
        pageSize={25}
      />
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {c.note}
      </p>
    </div>
  );
}

export function ApprovalsPanel({ href }: { href: string }) {
  return (
    <Panel
      title={t.content.title}
      subtitle={t.content.description}
      id="approvals-title"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href={href}>{t.approvalsCta}</Link>
        </Button>
      }
    >
      <ContentApprovals compact />
    </Panel>
  );
}

// ---------- Users ----------

const ANY = "any";

export function UsersView() {
  const { users } = useAdmin();
  const u = t.users;
  const [role, setRole] = useState(ANY);
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = users.filter((x) => role === ANY || x.role === role);
  const current = users.find((x) => x.id === openId);
  const columns = useMemo<ColumnDef<UserRow, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: u.columns.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <InitialsAvatar name={row.original.name} />
            <span className="font-medium text-heading">{row.original.name}</span>
          </div>
        ),
      },
      { accessorKey: "role", header: u.columns.role, enableGlobalFilter: false },
      { accessorKey: "organisation", header: u.columns.organisation },
      {
        accessorKey: "status",
        header: u.columns.status,
        cell: ({ row }) => (
          <Badge variant={row.original.status === "Active" ? "open" : "archived"} className={row.original.status === "Active" ? undefined : "border-dashed"}>
            {u.status[row.original.status]}
          </Badge>
        ),
        enableGlobalFilter: false,
      },
      {
        accessorKey: "joinedDaysAgo",
        header: ({ column }) => <SortHeader label={u.columns.joined} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => ago(row.original.joinedDaysAgo),
        enableGlobalFilter: false,
      },
      {
        id: "action",
        header: () => <span className="sr-only">{u.details}</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => setOpenId(row.original.id)}>
              {u.details}
              <span className="sr-only">: {row.original.name}</span>
            </Button>
          </div>
        ),
      },
    ],
    [u],
  );
  return (
    <>
      <DataGrid
        data={rows}
        columns={columns}
        caption={u.title}
        searchLabel={u.search}
        searchPlaceholder={u.searchPlaceholder}
        toolbar={
          <ToolbarSelect
            label={u.role}
            value={role}
            onChange={setRole}
            options={[{ value: ANY, label: u.allRoles }, ...["Student", "School", "Company", "Admin"].map((r) => ({ value: r, label: r }))]}
          />
        }
      />
      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current?.name ?? ""}>
        {current && (
          <dl className="divide-y text-sm">
            {(
              [
                [u.columns.role, current.role],
                [u.columns.organisation, current.organisation],
                [u.columns.status, u.status[current.status]],
                [u.columns.joined, ago(current.joinedDaysAgo)],
              ] as [string, string][]
            ).map(([k, val]) => (
              <div key={k} className="py-3 first:pt-0">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 font-medium text-heading">{val}</dd>
              </div>
            ))}
          </dl>
        )}
      </DetailDrawer>
    </>
  );
}
