"use client";

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CalendarClock, CheckCircle2, FilePlus2, Info, SearchX, Star, Users } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { DataTable, EmptyState, Panel } from "@/components/dashboard/parts";
import { isActiveStage, useCompanyData, type CompanyApplicant } from "@/components/dashboard/company/CompanyData";
import { ProfileDrawerBody, TalentTile } from "@/components/dashboard/company/TalentParts";
import { ErrorSummary, SelectField, TextArea, TextField } from "@/components/forms/Fields";
import { companyText as t, dashboardText } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { company, interviews, stages, type Posting, type PostingStatus, type Stage } from "@/data/company";
import { talentProfiles, type TalentProfile } from "@/data/talent";
import { defaultPrivacy, readStudentPrivacy, withPrivacy, type StudentPrivacy } from "@/lib/privacy";
import { addNotice } from "@/lib/prototypeStore";
import { MESSAGE_STORE } from "@/components/dashboard/student/MessagesView";
import { messagesText } from "@/content/dashboard";
import { useEffect } from "react";

/*
  Company dashboard views (Checkpoint 8), in the student dashboard's visual language.
  All changes are kept in this browser tab (see CompanyData).
*/

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";
const talentById = (id: string) => talentProfiles.find((p) => p.id === id)!;
const ago = (n: number) => t.postingsPage.postedAgo[String(n)] ?? t.postingsPage.postedAgo.n.replace("{n}", String(n));

const stageLook: Record<Stage, string> = {
  new: "bg-navy-900 text-white",
  reviewing: "border border-navy-900 text-navy-900",
  interview: "bg-green-50 text-green-700",
  offer: "bg-green-700 text-white",
  "not-progressing": "bg-gray-200 text-gray-800",
};
const statusLook: Record<PostingStatus, string> = {
  open: "bg-green-700 text-white",
  draft: "border border-dashed border-gray-500 text-gray-700",
  closed: "bg-gray-200 text-gray-800",
};

export function StagePill({ stage }: { stage: Stage }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-0.5 text-sm font-semibold ${stageLook[stage]}`}>{t.applicantsPage.stages[stage]}</span>;
}
function StatusPill({ status }: { status: PostingStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-0.5 text-sm font-semibold ${statusLook[status]}`}>{t.postingsPage.status[status]}</span>;
}

// Profile drawer shared by the talent views
function useProfileDrawer() {
  const [openId, setOpenId] = useState<string | null>(null);
  const profile = openId ? talentById(openId) : null;
  const drawer = (
    <DetailDrawer open={!!profile} onClose={() => setOpenId(null)} title={profile?.name ?? ""}>
      {profile && <ProfileDrawerBody profile={profile} />}
    </DetailDrawer>
  );
  return { open: setOpenId, drawer };
}

// ---------- Overview pieces ----------

export function WelcomeLine() {
  const { postings, applicants, ready } = useCompanyData();
  if (!ready) return <span>&nbsp;</span>;
  return (
    <>
      {t.welcomeLine
        .replace("{open}", String(postings.filter((p) => p.status === "open").length))
        .replace("{applicants}", String(applicants.filter((a) => isActiveStage(a.stage)).length))}
    </>
  );
}

export function RecommendedTalent({ href }: { href: string }) {
  const { postings } = useCompanyData();
  const { open, drawer } = useProfileDrawer();
  const wanted = new Set(postings.filter((p) => p.status === "open").flatMap((p) => p.skills));
  const picks = talentProfiles
    .filter((p) => p.verification === "verified")
    .map((p) => ({ p, score: p.skills.filter((s) => wanted.has(s)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p);
  return (
    <Panel
      title={t.recommended.title}
      subtitle={t.recommended.subtitle}
      id="recommended-title"
      action={
        <Button href={href} variant="text">
          {t.recommended.viewAll}
        </Button>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 min-[87.5rem]:grid-cols-4">
        {picks.map((p, i) => (
          <li key={p.id}>
            <TalentTile profile={p} index={i} onOpen={() => open(p.id)} />
          </li>
        ))}
      </ul>
      {drawer}
    </Panel>
  );
}

export function HiringSnapshot({ href }: { href: string }) {
  const { postings, applicants, shortlist } = useCompanyData();
  const s = t.snapshot;
  const openRoles = postings.filter((p) => p.status === "open").length;
  const mini = [
    { icon: Users, value: applicants.filter((a) => isActiveStage(a.stage)).length, label: s.stats.applicants },
    { icon: CalendarClock, value: applicants.filter((a) => a.stage === "interview").length, label: s.stats.interviews },
    { icon: Star, value: shortlist.length, label: s.stats.shortlisted },
  ];
  return (
    <Panel
      title={s.title}
      subtitle={s.subtitle}
      id="snapshot-title"
      action={
        <Link
          href={href}
          aria-label={s.open}
          className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-navy-900 hover:bg-green-50 ${ring}`}
        >
          <ArrowUpRight aria-hidden className="size-5" />
        </Link>
      }
    >
      <div className="rounded-panel bg-linear-to-br from-navy-900 to-green-deep p-6 text-white">
        <p className="text-eyebrow uppercase">{s.cardLabel}</p>
        <p className="mt-5">{s.rolesOpen}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-display-mobile">{openRoles}</span>
          <span className="text-h3">{s.rolesUnit}</span>
        </p>
        <p className="mt-6 font-semibold">{company.name}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {mini.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-tile bg-gray-50 p-4">
            <Icon aria-hidden className="size-5 text-green-700" />
            <p className="mt-2 text-h3 text-navy-900">{value}</p>
            <p className="text-sm text-gray-700">{label}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function RecentApplicants({ href }: { href: string }) {
  const { applicants, postings } = useCompanyData();
  const r = t.recentApplicants;
  const rows = applicants.filter((a) => isActiveStage(a.stage)).sort((a, b) => a.appliedDaysAgo - b.appliedDaysAgo).slice(0, 4);
  return (
    <Panel title={r.title} subtitle={r.subtitle} id="recent-title" action={<Button href={href} variant="text">{r.open}</Button>}>
      <ul className="space-y-1">
        {rows.map((a) => {
          const p = talentById(a.talentId);
          const posting = postings.find((x) => x.id === a.postingId);
          return (
            <li key={a.id} className="flex flex-wrap items-center gap-4 rounded-tile px-3 py-3 hover:bg-gray-50">
              <span aria-hidden className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white">
                {p.name.split(" ").map((w) => w[0]).join("")}
              </span>
              <div className="min-w-40 flex-1">
                <p className="font-semibold text-navy-900">{p.name}</p>
                <p className="text-sm text-gray-700">
                  {posting?.title} · {a.fromSession ? t.applicantsPage.thisSession : ago(a.appliedDaysAgo)}
                </p>
              </div>
              <StagePill stage={a.stage} />
              <Button href={href} variant="navy" shape="pill">
                {r.review}
                <span className="sr-only">: {p.name}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function CompanyToday({ firstName, applicantsHref, opportunitiesHref }: { firstName: string; applicantsHref: string; opportunitiesHref: string }) {
  const { applicants, postings } = useCompanyData();
  const [tab, setTab] = useState<"review" | "interview" | "post">("review");
  const d = t.today;
  const toReview = applicants.filter((a) => a.stage === "new" || a.stage === "reviewing").length;
  const drafts = postings.filter((p) => p.status === "draft").length;
  const keys = ["review", "interview", "post"] as const;
  const icons = { review: Users, interview: CalendarClock, post: FilePlus2 };
  return (
    <section aria-labelledby="ctoday-title" className="min-w-0 rounded-panel bg-white p-5 md:p-8">
      <h2 id="ctoday-title" className="text-h3 text-navy-900 md:text-panel">
        {d.title.replace("{name}", firstName)}
      </h2>
      <div role="tablist" aria-label={d.title.replace("{name}", firstName)} className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-gray-50 p-1.5">
        {keys.map((k) => {
          const Icon = icons[k];
          return (
            <button
              key={k}
              id={`ctab-${k}`}
              role="tab"
              aria-selected={tab === k}
              aria-controls={`cpanel-${k}`}
              tabIndex={tab === k ? 0 : -1}
              onClick={() => setTab(k)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                const i = keys.indexOf(tab);
                const next = keys[(i + (e.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length];
                setTab(next);
                document.getElementById(`ctab-${next}`)?.focus();
              }}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-sm font-semibold sm:text-body ${ring} ${
                tab === k ? "bg-green-700 text-white" : "text-navy-900 hover:bg-white"
              }`}
            >
              <Icon aria-hidden className="size-4" /> {d.tabs[k]}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`cpanel-${tab}`} aria-labelledby={`ctab-${tab}`} className="mt-6">
        {tab === "review" && (
          <>
            <h3 className="text-h3 text-navy-900">{d.reviewTitle}</h3>
            <p className="mt-1 text-gray-700">{toReview === 0 ? d.reviewNone : toReview === 1 ? d.reviewBodyOne : d.reviewBody.replace("{n}", String(toReview))}</p>
            <div className="mt-5">
              <Button href={applicantsHref} variant="outline" shape="pill">{d.reviewAction}</Button>
            </div>
          </>
        )}
        {tab === "interview" && (
          <>
            <h3 className="text-h3 text-navy-900">{d.interviewTitle}</h3>
            <ul className="mt-3 space-y-3">
              {interviews.map((iv) => (
                <li key={iv.talentId + iv.postingId} className="rounded-tile bg-green-50 p-4">
                  <p className="font-bold text-navy-900">
                    {talentById(iv.talentId).name} · {postings.find((p) => p.id === iv.postingId)?.title}
                  </p>
                  <p className="text-gray-700">
                    {iv.when} · {iv.where}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button href={applicantsHref} variant="outline" shape="pill">{d.interviewAction}</Button>
            </div>
          </>
        )}
        {tab === "post" && (
          <>
            <h3 className="text-h3 text-navy-900">{d.postTitle}</h3>
            <p className="mt-1 text-gray-700">{drafts === 0 ? d.postNone : drafts === 1 ? d.postBodyOne : d.postBody.replace("{n}", String(drafts))}</p>
            <div className="mt-5">
              <Button href={opportunitiesHref} variant="outline" shape="pill">{d.postAction}</Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ---------- Talent discovery ----------

export function TalentDiscovery() {
  const c = t.talent;
  const { open, drawer } = useProfileDrawer();
  const [q, setQ] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [availability, setAvailability] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  // The sample student's current privacy choice decides whether her availability counts as shared.
  const [privacy, setPrivacy] = useState<StudentPrivacy | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage, read after mount
    setPrivacy(readStudentPrivacy(defaultPrivacy(talentById("sample-1"))));
  }, []);
  const profiles = talentProfiles.map((p) => withPrivacy(p, privacy));
  const disciplines = [...new Set(profiles.map((p) => p.discipline))];
  const query = q.trim().toLowerCase();
  const shown = profiles.filter(
    (p) =>
      (!discipline || p.discipline === discipline) &&
      (!verifiedOnly || p.verification === "verified") &&
      (availability !== c.availabilityOptions.shared || p.availability?.consented) &&
      (!query || p.name.toLowerCase().includes(query) || p.skills.some((s) => s.toLowerCase().includes(query))),
  );
  const field = `mt-2 block w-full rounded-full border border-gray-500 bg-white px-4 py-2.5 text-gray-800 ${ring}`;
  return (
    <div className="space-y-6">
      <section aria-label={c.title} className="rounded-panel bg-white p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <label className="block font-semibold text-navy-900">
            {c.search}
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.searchPlaceholder} className={field} />
          </label>
          <label className="block font-semibold text-navy-900">
            {c.discipline}
            <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className={field}>
              <option value="">{c.availabilityOptions.any}</option>
              {disciplines.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block font-semibold text-navy-900">
            {c.availability}
            <select value={availability} onChange={(e) => setAvailability(e.target.value)} className={field}>
              <option value="">{c.availabilityOptions.any}</option>
              <option>{c.availabilityOptions.shared}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-3 font-semibold text-navy-900">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="size-4 accent-green-700" />
          {c.verifiedOnly}
        </label>
        <p aria-live="polite" className="mt-3 text-gray-700">
          {dashboardText.showing.replace("{n}", String(shown.length)).replace("{total}", String(talentProfiles.length))}
        </p>
      </section>
      {shown.length === 0 ? (
        <EmptyState icon={SearchX} title={dashboardText.noResults.title} body={dashboardText.noResults.body} />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[87.5rem]:grid-cols-4">
          {shown.map((p, i) => (
            <li key={p.id}>
              <TalentTile profile={p} index={i} onOpen={() => open(p.id)} />
            </li>
          ))}
        </ul>
      )}
      {drawer}
    </div>
  );
}

// ---------- Shortlist ----------

export function ShortlistView({ talentHref }: { talentHref: string }) {
  const { shortlist, ready } = useCompanyData();
  const { open, drawer } = useProfileDrawer();
  const e = t.shortlistPage.empty;
  if (!ready) return <div className="min-h-40" />;
  const saved = shortlist.map(talentById).filter(Boolean) as TalentProfile[];
  if (saved.length === 0) return <EmptyState icon={Star} title={e.title} body={e.body} action={{ label: e.action, href: talentHref }} />;
  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[87.5rem]:grid-cols-4">
        {saved.map((p, i) => (
          <li key={p.id}>
            <TalentTile profile={p} index={i} onOpen={() => open(p.id)} />
          </li>
        ))}
      </ul>
      {drawer}
    </>
  );
}

// ---------- Opportunities (postings) ----------

type FormValues = { title: string; location: string; mode: string; skills: string; description: string };
const emptyForm: FormValues = { title: "", location: "", mode: "", skills: "", description: "" };

export function PostingsView() {
  const { postings, applicants, setPostingStatus, addPosting } = useCompanyData();
  const p = t.postingsPage;
  const [openId, setOpenId] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const current = postings.find((x) => x.id === openId);
  const count = (id: string) => applicants.filter((a) => a.postingId === id && isActiveStage(a.stage)).length;

  function validate(v: FormValues) {
    const e: Record<string, string> = {};
    if (!v.title.trim()) e["post-title"] = formText.required;
    if (!v.location.trim()) e["post-location"] = formText.required;
    if (!v.mode) e["post-mode"] = formText.required;
    if (!v.skills.trim()) e["post-skills"] = formText.required;
    if (!v.description.trim()) e["post-description"] = formText.required;
    return e;
  }
  function submit(status: PostingStatus) {
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const posting: Posting = {
      id: `new-${Date.now()}`,
      title: values.title.trim(),
      location: values.location.trim(),
      mode: values.mode,
      skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
      description: values.description.trim(),
      status,
      postedDaysAgo: 0,
    };
    addPosting(posting);
    setValues(emptyForm);
    dialogRef.current?.close();
  }
  const set = (k: keyof FormValues) => (v: string) => setValues((x) => ({ ...x, [k]: v }));
  const f = p.form;

  return (
    <>
      <div className="flex justify-end">
        <Button shape="pill" onClick={() => dialogRef.current?.showModal()}>
          <FilePlus2 aria-hidden className="size-5" /> {t.postCta}
        </Button>
      </div>
      <section aria-label={p.title} className="mt-6 rounded-panel bg-white p-5 md:p-8">
        <DataTable
          caption={p.title}
          columns={[
            { key: "title", header: p.columns.title },
            { key: "status", header: p.columns.status },
            { key: "applicants", header: p.columns.applicants },
            { key: "posted", header: p.columns.posted },
            { key: "action", header: "", className: "text-right" },
          ]}
          rows={postings.map((x) => ({
            key: x.id,
            cells: {
              title: (
                <span>
                  {x.title}
                  <span className="block text-sm font-normal text-gray-700">
                    {x.location} · {x.mode}
                  </span>
                </span>
              ),
              status: <StatusPill status={x.status} />,
              applicants: count(x.id),
              posted: x.status === "draft" ? "–" : ago(x.postedDaysAgo),
              action: (
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(x.id);
                    setChanged(false);
                  }}
                  className={`rounded-sm font-semibold text-green-700 underline-offset-4 hover:text-green-800 hover:underline ${ring}`}
                >
                  {p.manage}
                  <span className="sr-only">: {x.title}</span>
                </button>
              ),
            },
          }))}
        />
      </section>

      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current?.title ?? ""}>
        {current && (
          <div className="space-y-5">
            <StatusPill status={current.status} />
            <p className="text-gray-800">{current.description}</p>
            <ul className="flex flex-wrap gap-2">
              {current.skills.map((s) => (
                <li key={s} className="rounded-full bg-gray-50 px-3 py-1 text-sm font-semibold text-navy-900">
                  {s}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              {current.status === "open" && (
                <Button variant="outline" shape="pill" onClick={() => { setPostingStatus(current.id, "closed"); setChanged(true); }}>
                  {p.close}
                </Button>
              )}
              {current.status === "closed" && (
                <Button shape="pill" onClick={() => { setPostingStatus(current.id, "open"); setChanged(true); }}>
                  {p.reopen}
                </Button>
              )}
              {current.status === "draft" && (
                <Button shape="pill" onClick={() => { setPostingStatus(current.id, "open"); setChanged(true); }}>
                  {p.publish}
                </Button>
              )}
            </div>
            {changed && (
              <p role="status" className="flex items-start gap-2 rounded-tile bg-green-50 p-4 text-gray-800">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" /> {p.statusChanged}
              </p>
            )}
          </div>
        )}
      </DetailDrawer>

      <dialog
        ref={dialogRef}
        aria-labelledby="post-title-h"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-panel bg-white p-0 backdrop:bg-navy-900/60"
      >
        <form noValidate onSubmit={(e) => { e.preventDefault(); submit("open"); }} className="space-y-5 p-6">
          <h2 id="post-title-h" className="text-h3 text-navy-900">{f.title}</h2>
          <p className="flex items-start gap-2 text-sm text-gray-700">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {f.prototype}
          </p>
          <ErrorSummary
            title={formText.errorSummaryTitle}
            errors={errors}
            labels={{ "post-title": f.role, "post-location": f.location, "post-mode": f.mode, "post-skills": f.skills, "post-description": f.description }}
            summaryRef={summaryRef}
          />
          <TextField id="post-title" label={f.role} required value={values.title} onChange={set("title")} error={errors["post-title"]} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="post-location" label={f.location} required value={values.location} onChange={set("location")} error={errors["post-location"]} />
            <SelectField id="post-mode" label={f.mode} required value={values.mode} onChange={set("mode")} options={f.modes} placeholder={formText.choose} error={errors["post-mode"]} />
          </div>
          <TextField id="post-skills" label={f.skills} required value={values.skills} onChange={set("skills")} error={errors["post-skills"]} />
          <TextArea id="post-description" label={f.description} required value={values.description} onChange={set("description")} error={errors["post-description"]} />
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button variant="text" onClick={() => dialogRef.current?.close()}>{f.cancel}</Button>
            <Button variant="outline" shape="pill" onClick={() => submit("draft")}>{f.asDraft}</Button>
            <Button type="submit" shape="pill">{f.publish}</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

// ---------- Applicants ----------

export function ApplicantsView() {
  const { applicants, postings, setStage, ready } = useCompanyData();
  const a = t.applicantsPage;
  const [role, setRole] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "">("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const shown = applicants.filter((x) => (!role || x.postingId === role) && (!stageFilter || x.stage === stageFilter));
  const current = applicants.find((x) => x.id === openId) as CompanyApplicant | undefined;
  const sessionApp = applicants.some((x) => x.fromSession);
  const field = `mt-2 block w-full rounded-full border border-gray-500 bg-white px-4 py-2.5 text-gray-800 ${ring}`;

  return (
    <div className="space-y-6">
      {ready && !sessionApp && (
        <p className="flex items-start gap-2 rounded-tile border border-dashed border-gray-500 bg-white p-4 text-gray-700">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0" /> {a.hint}
        </p>
      )}
      <section aria-label={a.title} className="rounded-panel bg-white p-5 md:p-8">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
          <label className="block font-semibold text-navy-900">
            {a.role}
            <select value={role} onChange={(e) => setRole(e.target.value)} className={field}>
              <option value="">{a.allRoles}</option>
              {postings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block font-semibold text-navy-900">
            {a.columns.stage}
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as Stage | "")} className={field}>
              <option value="">{a.allStages}</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {a.stages[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6">
          {shown.length === 0 ? (
            <EmptyState icon={BriefcaseBusiness} title={a.empty.title} body={a.empty.body} />
          ) : (
            <DataTable
              caption={a.title}
              columns={[
                { key: "name", header: a.columns.name },
                { key: "role", header: a.columns.role },
                { key: "stage", header: a.columns.stage },
                { key: "applied", header: a.columns.applied },
                { key: "action", header: "", className: "text-right" },
              ]}
              rows={shown.map((x) => {
                const p = talentById(x.talentId);
                return {
                  key: x.id,
                  cells: {
                    name: (
                      <span>
                        {p.name}
                        <span className="block text-sm font-normal text-gray-700">{p.discipline}</span>
                      </span>
                    ),
                    role: postings.find((y) => y.id === x.postingId)?.title,
                    stage: <StagePill stage={x.stage} />,
                    applied: x.fromSession ? a.thisSession : ago(x.appliedDaysAgo),
                    action: (
                      <Button variant="navy" shape="pill" onClick={() => { setOpenId(x.id); setSaved(false); }}>
                        {t.recentApplicants.review}
                        <span className="sr-only">: {p.name}</span>
                      </Button>
                    ),
                  },
                };
              })}
            />
          )}
        </div>
        <p className="mt-4 text-sm text-gray-700">{a.note}</p>
      </section>

      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current ? talentById(current.talentId).name : ""}>
        {current && (
          <div className="space-y-5">
            <p className="text-gray-700">
              {postings.find((y) => y.id === current.postingId)?.title} · {current.fromSession ? a.thisSession : ago(current.appliedDaysAgo)}
            </p>
            <label className="block font-semibold text-navy-900">
              {a.moveTo}
              <select
                value={current.stage}
                onChange={(e) => {
                  setStage(current.id, e.target.value as Stage);
                  setSaved(true);
                }}
                className={field}
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {a.stages[s]}
                  </option>
                ))}
              </select>
            </label>
            {saved && (
              <p role="status" className="flex items-start gap-2 rounded-tile bg-green-50 p-4 text-gray-800">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-green-700" /> {a.stageSaved}
              </p>
            )}
            {current.talentId === "sample-1" && <MessageApplicant name={talentById(current.talentId).name} />}
            <ProfileDrawerBody profile={talentById(current.talentId)} />
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

// Grace can message the sample student from her application (Checkpoint 13). The message
// arrives in the student's Messages, in the conversation with Grace, plus a notification.
function MessageApplicant({ name }: { name: string }) {
  const m = messagesText;
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) {
          setError(m.empty);
          return;
        }
        try {
          const all = JSON.parse(sessionStorage.getItem(MESSAGE_STORE) ?? "{}");
          all.company = [...(all.company ?? []), { from: "them", text: text.trim(), at: new Date().toISOString() }];
          sessionStorage.setItem(MESSAGE_STORE, JSON.stringify(all));
        } catch {}
        addNotice("student", m.newNotice.replace("{name}", "Grace N."));
        setText("");
        setSent(true);
      }}
      className="rounded-tile border border-gray-200 p-4"
    >
      <label htmlFor="msg-applicant" className="font-semibold text-navy-900">
        {m.companyAction.replace("{name}", name)}
      </label>
      <textarea
        id="msg-applicant"
        rows={3}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
          setSent(false);
        }}
        placeholder={m.companyPlaceholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "msg-applicant-error" : undefined}
        className={`mt-2 block w-full rounded-control border border-gray-500 px-3 py-2 text-gray-800 ${ring}`}
      />
      {error && <p id="msg-applicant-error" className="mt-2 font-semibold text-navy-900">{error}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="navy" shape="pill">{m.send}</Button>
        <p role="status" className="text-sm font-semibold text-green-700">{sent ? m.companySent.replace("{name}", name) : ""}</p>
      </div>
    </form>
  );
}
