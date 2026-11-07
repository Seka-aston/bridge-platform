"use client";

import { CalendarClock, CheckCircle2, FileCheck2, Hourglass, Info, Plus, Users } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { StatusPill } from "@/components/StatusPill";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { DataTable, Panel } from "@/components/dashboard/parts";
import { ago, Pill, ring, SummaryPanel, TodayTabs } from "@/components/dashboard/kit";
import { ErrorSummary, TextArea, TextField } from "@/components/forms/Fields";
import { adminText as t, sharedText } from "@/content/dashboard";
import { footer, trust } from "@/content/home";
import { formText } from "@/content/pages";
import { extraUsers, type UserRow } from "@/data/admin";
import { articles } from "@/data/articles";
import { programmes as samplePrograms, type Programme } from "@/data/programmes";
import { talentProfiles } from "@/data/talent";
import { sampleUsers } from "@/data/users";
import { school } from "@/data/school";
import { company } from "@/data/company";
import { formatDate, programmeStatus, todayInKigali } from "@/lib/programmes";
import { APPROVAL_STORE, PROGRAMME_EDITS_STORE, readSession } from "@/lib/prototypeStore";

/*
  Admin dashboard (Checkpoint 10), in the student dashboard's visual language.
  Programme status is always calculated from the dates (CLAUDE.md, component 8).
  Changes are kept in this browser tab; showing them on the public site is Checkpoint 11.
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
  return (
    <>
      {(() => {
        const open = programmes.filter((p) => programmeStatus(p, today) === "open").length;
        return (open === 1 ? t.welcomeLineOne : t.welcomeLine).replace("{pending}", String(pendingCount(items, decisions))).replace("{open}", String(open));
      })()}
    </>
  );
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
        { icon: CalendarClock, value: count("open"), label: s.stats.open },
        { icon: Hourglass, value: count("upcoming"), label: s.stats.upcoming },
        { icon: FileCheck2, value: pendingCount(items, decisions), label: s.stats.pending },
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
      <h3 className="text-h3 text-navy-900">{title}</h3>
      <p className="mt-1 text-gray-700">{body}</p>
      <div className="mt-5">
        <Button href={href} variant="outline" shape="pill">{action}</Button>
      </div>
    </>
  );
  return (
    <TodayTabs
      id="atoday"
      title={d.title.replace("{name}", firstName)}
      tabs={[
        { key: "approve", label: d.tabs.approve, icon: FileCheck2, content: block(t.content.title, pending ? d.approveBody.replace("{n}", String(pending)) : d.approveNone, contentHref, d.approveAction) },
        { key: "programmes", label: d.tabs.programmes, icon: CalendarClock, content: block(t.programmes.title, d.programmesBody.replace("{n}", String(open)), programmesHref, d.programmesAction) },
        { key: "users", label: d.tabs.users, icon: Users, content: block(t.users.title, d.usersBody.replace("{n}", String(invited)), usersHref, d.usersAction) },
      ]}
    />
  );
}

// ---------- Programme manager ----------

type FormV = { name: string; summary: string; opensOn: string; closesOn: string; endsOn: string };

export function ProgrammeManager({ compact = false }: { compact?: boolean }) {
  const { programmes, saveProgramme, today, ready, sessionApps } = useAdmin();
  const p = t.programmes;
  const f = p.form;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<Programme | null>(null);
  const [v, setV] = useState<FormV>({ name: "", summary: "", opensOn: "", closesOn: "", endsOn: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function openForm(prog: Programme | null) {
    setEditing(prog);
    setV(prog ? { name: prog.name, summary: prog.summary, opensOn: prog.opensOn, closesOn: prog.closesOn, endsOn: prog.endsOn } : { name: "", summary: "", opensOn: "", closesOn: "", endsOn: "" });
    setErrors({});
    dialogRef.current?.showModal();
  }
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
    setSaved(true);
    dialogRef.current?.close();
  }

  const shown = compact ? programmes.slice(0, 5) : programmes;
  return (
    <>
      {!compact && (
        <div className="flex justify-end">
          <Button shape="pill" onClick={() => openForm(null)}>
            <Plus aria-hidden className="size-5" /> {t.newProgrammeCta}
          </Button>
        </div>
      )}
      {saved && <p role="status" className="mt-4 rounded-tile bg-green-50 p-4 text-gray-800">{sharedText.saved}</p>}
      <section aria-label={p.title} className={compact ? "" : "mt-6 rounded-panel bg-white p-5 md:p-8"}>
        {ready && (
          <DataTable
            caption={p.title}
            columns={[
              { key: "name", header: p.columns.name },
              { key: "status", header: p.columns.status },
              { key: "opens", header: p.columns.opens },
              { key: "closes", header: p.columns.closes },
              { key: "action", header: "", className: "text-right" },
            ]}
            rows={shown.map((x) => ({
              key: x.id,
              cells: {
                name: (
                  <span>
                    {x.name}
                    {sessionApps.includes(x.id) && <span className="block text-sm font-semibold text-green-700">{t.programmes.sessionApplied}</span>}
                  </span>
                ),
                status: <StatusPill status={programmeStatus(x, today)} />,
                opens: formatDate(x.opensOn),
                closes: formatDate(x.closesOn),
                action: (
                  <button type="button" onClick={() => openForm(x)} className={`rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline ${ring}`}>
                    {p.edit}
                    <span className="sr-only">: {x.name}</span>
                  </button>
                ),
              },
            }))}
          />
        )}
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="pg-form-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-panel bg-white p-0 backdrop:bg-navy-900/60"
      >
        <form noValidate onSubmit={save} className="space-y-5 p-6">
          <h2 id="pg-form-title" className="text-h3 text-navy-900">{editing ? f.editTitle.replace("{name}", editing.name) : f.createTitle}</h2>
          <p className="flex items-start gap-2 text-sm text-gray-700"><Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {f.prototype}</p>
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
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" shape="pill" onClick={() => setV({ ...v, opensOn: today, closesOn: v.closesOn && v.closesOn >= today ? v.closesOn : today })}>{f.openNow}</Button>
            <Button variant="outline" shape="pill" onClick={() => setV({ ...v, closesOn: today, opensOn: v.opensOn && v.opensOn <= today ? v.opensOn : today })}>{f.closeNow}</Button>
          </div>
          <p aria-live="polite" className="flex items-center gap-2 font-semibold text-navy-900">
            {previewStatus && (
              <>
                {f.statusPreview.replace("{status}", "")} <StatusPill status={previewStatus} />
              </>
            )}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" shape="pill" onClick={() => dialogRef.current?.close()}>{f.cancel}</Button>
            <Button type="submit" shape="pill">{f.save}</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

// ---------- Content approvals ----------

const decisionLook: Record<"pending" | Decision, string> = {
  pending: "border border-dashed border-gray-500 text-gray-700",
  approved: "bg-green-700 text-white",
  changes: "border border-navy-900 text-navy-900",
};

export function ContentApprovals({ compact = false }: { compact?: boolean }) {
  const { items, decisions, decide, ready } = useAdmin();
  const c = t.content;
  if (!ready) return <div className="min-h-40" />;
  const shown = compact ? items.filter((i) => !decisions[i.key]).slice(0, 4) : items;
  return (
    <div>
      <DataTable
        caption={c.title}
        columns={[
          { key: "item", header: c.columns.item },
          { key: "type", header: c.columns.type },
          { key: "status", header: c.columns.status },
          { key: "action", header: "", className: "text-right" },
        ]}
        rows={shown.map((i) => {
          const d = decisions[i.key];
          return {
            key: i.key,
            cells: {
              item: i.label,
              type: c.types[i.type],
              status: <Pill label={c.status[d ?? "pending"]} look={decisionLook[d ?? "pending"]} />,
              action: d ? (
                <CheckCircle2 aria-hidden className="ml-auto size-5 text-green-700" />
              ) : (
                <span className="flex justify-end gap-2">
                  <Button variant="navy" shape="pill" onClick={() => decide(i.key, "approved")}>
                    {c.approve}
                    <span className="sr-only">: {i.label}</span>
                  </Button>
                  <Button variant="outline" shape="pill" onClick={() => decide(i.key, "changes")}>
                    {c.requestChanges}
                    <span className="sr-only">: {i.label}</span>
                  </Button>
                </span>
              ),
            },
          };
        })}
      />
      <p className="mt-4 flex items-start gap-2 text-sm text-gray-700"><Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {c.note}</p>
    </div>
  );
}

export function ApprovalsPanel({ href }: { href: string }) {
  return (
    <Panel title={t.content.title} subtitle={t.content.description} id="approvals-title" action={<Button href={href} variant="text">{t.approvalsCta}</Button>}>
      <ContentApprovals compact />
    </Panel>
  );
}

// ---------- Users ----------

export function UsersView() {
  const { users } = useAdmin();
  const u = t.users;
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const query = q.trim().toLowerCase();
  const shown = users.filter((x) => (!role || x.role === role) && (!query || `${x.name} ${x.organisation}`.toLowerCase().includes(query)));
  const current = users.find((x) => x.id === openId);
  const field = `mt-2 block w-full rounded-full border border-gray-500 bg-white px-4 py-2.5 text-gray-800 ${ring}`;
  return (
    <section aria-label={u.title} className="rounded-panel bg-white p-5 md:p-8">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="block font-semibold text-navy-900">
          {u.search}
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.searchPlaceholder} className={field} />
        </label>
        <label className="block font-semibold text-navy-900">
          {u.role}
          <select value={role} onChange={(e) => setRole(e.target.value)} className={field}>
            <option value="">{u.allRoles}</option>
            {["Student", "School", "Company", "Admin"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-6">
        <DataTable
          caption={u.title}
          columns={[
            { key: "name", header: u.columns.name },
            { key: "role", header: u.columns.role },
            { key: "organisation", header: u.columns.organisation },
            { key: "status", header: u.columns.status },
            { key: "joined", header: u.columns.joined },
            { key: "action", header: "", className: "text-right" },
          ]}
          rows={shown.map((x) => ({
            key: x.id,
            cells: {
              name: x.name,
              role: x.role,
              organisation: x.organisation,
              status: <Pill label={u.status[x.status]} look={x.status === "Active" ? "bg-green-50 text-green-700" : "border border-dashed border-gray-500 text-gray-700"} />,
              joined: ago(x.joinedDaysAgo),
              action: (
                <button type="button" onClick={() => setOpenId(x.id)} className={`rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline ${ring}`}>
                  {u.details}
                  <span className="sr-only">: {x.name}</span>
                </button>
              ),
            },
          }))}
        />
      </div>
      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current?.name ?? ""}>
        {current && (
          <dl className="space-y-4">
            {(
              [
                [u.columns.role, current.role],
                [u.columns.organisation, current.organisation],
                [u.columns.status, u.status[current.status]],
                [u.columns.joined, ago(current.joinedDaysAgo)],
              ] as [string, string][]
            ).map(([k, val]) => (
              <div key={k}>
                <dt className="font-semibold text-navy-900">{k}</dt>
                <dd className="text-gray-700">{val}</dd>
              </div>
            ))}
          </dl>
        )}
      </DetailDrawer>
    </section>
  );
}
