"use client";

import Link from "next/link";
import { CalendarClock, CheckCircle2, FilePlus2, Info, Search, SearchX, Star, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DataGrid, SortHeader, type ColumnDef } from "@/components/dashboard/DataGrid";
import { SummaryPanel, ToolbarSelect } from "@/components/dashboard/kit";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { EmptyState, Panel } from "@/components/dashboard/parts";
import { isActiveStage, useCompanyData, type CompanyApplicant } from "@/components/dashboard/company/CompanyData";
import { initials, ProfileDrawerBody, TalentTile } from "@/components/dashboard/company/TalentParts";
import { MESSAGE_STORE } from "@/components/dashboard/student/MessagesView";
import { CheckboxField, ErrorSummary, SelectField, TextArea, TextField } from "@/components/forms/Fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companyText as t, dashboardText, messagesText } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { company, interviews, stages, type Posting, type PostingStatus, type Stage } from "@/data/company";
import { talentProfiles, type TalentProfile } from "@/data/talent";
import { defaultPrivacy, readStudentPrivacy, withPrivacy, type StudentPrivacy } from "@/lib/privacy";
import { addNotice } from "@/lib/prototypeStore";

/*
  Company dashboard views (redesign Step 7, on shadcn/ui). All changes are kept in this browser
  tab (see CompanyData).
*/

const talentById = (id: string) => talentProfiles.find((p) => p.id === id)!;
const ago = (n: number) => t.postingsPage.postedAgo[String(n)] ?? t.postingsPage.postedAgo.n.replace("{n}", String(n));
const ANY = "any";

// Stage and posting-status labels: always text, colour only supports it.
const stageVariant = { new: "featured", reviewing: "upcoming", interview: "secondary", offer: "default", "not-progressing": "closed" } as const;
const statusVariant = { open: "open", draft: "archived", closed: "closed" } as const;

export function StagePill({ stage }: { stage: Stage }) {
  return <Badge variant={stageVariant[stage]}>{t.applicantsPage.stages[stage]}</Badge>;
}
function StatusPill({ status }: { status: PostingStatus }) {
  return (
    <Badge variant={statusVariant[status]} className={status === "draft" ? "border-dashed" : undefined}>
      {t.postingsPage.status[status]}
    </Badge>
  );
}

function TalentAvatar({ name }: { name: string }) {
  return (
    <Avatar>
      <AvatarFallback className="bg-brand-navy text-xs font-semibold text-white">{initials(name)}</AvatarFallback>
    </Avatar>
  );
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

// A labelled shadcn Select for filters. Radix Select can't use "" as a value, so "any" stands for "no filter".
function FilterSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Field className="gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
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
        <Button asChild variant="outline" size="sm">
          <Link href={href}>{t.recommended.viewAll}</Link>
        </Button>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {picks.map((p) => (
          <li key={p.id}>
            <TalentTile profile={p} onOpen={() => open(p.id)} />
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
  return (
    <SummaryPanel
      id="snapshot-title"
      title={s.title}
      subtitle={s.subtitle}
      href={href}
      hrefLabel={s.open}
      cardLabel={s.cardLabel}
      bigLabel={s.rolesOpen}
      big={postings.filter((p) => p.status === "open").length}
      unit={s.rolesUnit}
      footer={company.name}
      stats={[
        { value: applicants.filter((a) => isActiveStage(a.stage)).length, label: s.stats.applicants },
        { value: applicants.filter((a) => a.stage === "interview").length, label: s.stats.interviews },
        { value: shortlist.length, label: s.stats.shortlisted },
      ]}
    />
  );
}

export function RecentApplicants({ href }: { href: string }) {
  const { applicants, postings } = useCompanyData();
  const r = t.recentApplicants;
  const rows = applicants.filter((a) => isActiveStage(a.stage)).sort((a, b) => a.appliedDaysAgo - b.appliedDaysAgo).slice(0, 4);
  return (
    <Panel
      title={r.title}
      subtitle={r.subtitle}
      id="recent-title"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href={href}>{r.open}</Link>
        </Button>
      }
    >
      <ul className="divide-y rounded-lg border">
        {rows.map((a) => {
          const p = talentById(a.talentId);
          const posting = postings.find((x) => x.id === a.postingId);
          return (
            <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <TalentAvatar name={p.name} />
              <div className="min-w-40 flex-1">
                <p className="font-medium text-heading">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {posting?.title} · {a.fromSession ? t.applicantsPage.thisSession : ago(a.appliedDaysAgo)}
                </p>
              </div>
              <StagePill stage={a.stage} />
              <Button asChild variant="navy" size="sm">
                <Link href={href}>
                  {r.review}
                  <span className="sr-only">: {p.name}</span>
                </Link>
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
  const d = t.today;
  const title = d.title.replace("{name}", firstName);
  const toReview = applicants.filter((a) => a.stage === "new" || a.stage === "reviewing").length;
  const drafts = postings.filter((p) => p.status === "draft").length;
  const action = (href: string, label: string) => (
    <Button asChild variant="outline" className="w-full">
      <Link href={href}>{label}</Link>
    </Button>
  );
  return (
    <Panel title={title} id="ctoday-title">
      <Tabs defaultValue="review">
        <TabsList aria-label={title} className="w-full">
          <TabsTrigger value="review" id="ctab-review">
            <Users aria-hidden /> {d.tabs.review}
          </TabsTrigger>
          <TabsTrigger value="interview" id="ctab-interview">
            <CalendarClock aria-hidden /> {d.tabs.interview}
          </TabsTrigger>
          <TabsTrigger value="post" id="ctab-post">
            <FilePlus2 aria-hidden /> {d.tabs.post}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="review" className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-heading">{d.reviewTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{toReview === 0 ? d.reviewNone : toReview === 1 ? d.reviewBodyOne : d.reviewBody.replace("{n}", String(toReview))}</p>
          </div>
          {action(applicantsHref, d.reviewAction)}
        </TabsContent>
        <TabsContent value="interview" className="mt-4 space-y-4">
          <h3 className="font-semibold text-heading">{d.interviewTitle}</h3>
          <ul className="space-y-2">
            {interviews.map((iv) => (
              <li key={iv.talentId + iv.postingId}>
                <Item variant="muted" size="sm">
                  <ItemMedia variant="icon">
                    <CalendarClock aria-hidden className="text-primary" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-heading">
                      {talentById(iv.talentId).name} · {postings.find((p) => p.id === iv.postingId)?.title}
                    </ItemTitle>
                    <ItemDescription>
                      {iv.when} · {iv.where}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </li>
            ))}
          </ul>
          {action(applicantsHref, d.interviewAction)}
        </TabsContent>
        <TabsContent value="post" className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-heading">{d.postTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{drafts === 0 ? d.postNone : drafts === 1 ? d.postBodyOne : d.postBody.replace("{n}", String(drafts))}</p>
          </div>
          {action(opportunitiesHref, d.postAction)}
        </TabsContent>
      </Tabs>
    </Panel>
  );
}

// ---------- Talent discovery ----------

export function TalentDiscovery() {
  const c = t.talent;
  const { open, drawer } = useProfileDrawer();
  const [q, setQ] = useState("");
  const [discipline, setDiscipline] = useState(ANY);
  const [availability, setAvailability] = useState(ANY);
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
      (discipline === ANY || p.discipline === discipline) &&
      (!verifiedOnly || p.verification === "verified") &&
      (availability === ANY || p.availability?.consented) &&
      (!query || p.name.toLowerCase().includes(query) || p.skills.some((s) => s.toLowerCase().includes(query))),
  );
  return (
    <div className="space-y-6">
      <Card as="section" aria-label={c.title} size="sm">
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="talent-search">{c.search}</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput id="talent-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={c.searchPlaceholder} />
              </InputGroup>
            </Field>
            <FilterSelect
              id="talent-discipline"
              label={c.discipline}
              value={discipline}
              onChange={setDiscipline}
              options={[{ value: ANY, label: c.availabilityOptions.any }, ...disciplines.map((d) => ({ value: d, label: d }))]}
            />
            <FilterSelect
              id="talent-availability"
              label={c.availability}
              value={availability}
              onChange={setAvailability}
              options={[
                { value: ANY, label: c.availabilityOptions.any },
                { value: "shared", label: c.availabilityOptions.shared },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CheckboxField id="talent-verified" label={c.verifiedOnly} checked={verifiedOnly} onChange={setVerifiedOnly} />
            <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
              {dashboardText.showing.replace("{n}", String(shown.length)).replace("{total}", String(talentProfiles.length))}
            </p>
          </div>
        </CardContent>
      </Card>
      {shown.length === 0 ? (
        <EmptyState icon={SearchX} title={dashboardText.noResults.title} body={dashboardText.noResults.body} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 min-[87.5rem]:grid-cols-4">
          {shown.map((p) => (
            <li key={p.id}>
              <TalentTile profile={p} onOpen={() => open(p.id)} />
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
  if (!ready) return <Skeleton className="h-40 w-full" />;
  const saved = shortlist.map(talentById).filter(Boolean) as TalentProfile[];
  if (saved.length === 0) return <EmptyState icon={Star} title={e.title} body={e.body} action={{ label: e.action, href: talentHref }} />;
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 min-[87.5rem]:grid-cols-4">
        {saved.map((p) => (
          <li key={p.id}>
            <TalentTile profile={p} onOpen={() => open(p.id)} />
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
type PostingRow = Posting & { applicants: number };

export function PostingsView() {
  const { postings, applicants, setPostingStatus, addPosting } = useCompanyData();
  const p = t.postingsPage;
  const f = p.form;
  const [openId, setOpenId] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const current = postings.find((x) => x.id === openId);
  const rows: PostingRow[] = postings.map((x) => ({ ...x, applicants: applicants.filter((a) => a.postingId === x.id && isActiveStage(a.stage)).length }));

  const columns = useMemo<ColumnDef<PostingRow, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: p.columns.title,
        cell: ({ row }) => (
          <span>
            <span className="block font-medium text-heading">{row.original.title}</span>
            <span className="block text-xs text-muted-foreground">
              {row.original.location} · {row.original.mode}
            </span>
          </span>
        ),
      },
      { accessorKey: "status", header: p.columns.status, cell: ({ row }) => <StatusPill status={row.original.status} />, enableGlobalFilter: false },
      {
        accessorKey: "applicants",
        header: ({ column }) => <SortHeader label={p.columns.applicants} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => <span className="tabular-nums">{row.original.applicants}</span>,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "postedDaysAgo",
        header: p.columns.posted,
        cell: ({ row }) => (row.original.status === "draft" ? "–" : ago(row.original.postedDaysAgo)),
        enableGlobalFilter: false,
      },
      {
        id: "action",
        header: () => <span className="sr-only">{p.manage}</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenId(row.original.id);
                setChanged(false);
              }}
            >
              {p.manage}
              <span className="sr-only">: {row.original.title}</span>
            </Button>
          </div>
        ),
      },
    ],
    [p],
  );

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
    addPosting({
      id: `new-${Date.now()}`,
      title: values.title.trim(),
      location: values.location.trim(),
      mode: values.mode,
      skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
      description: values.description.trim(),
      status,
      postedDaysAgo: 0,
    });
    toast.success((status === "draft" ? f.drafted : f.posted).replace("{title}", values.title.trim()));
    setValues(emptyForm);
    setFormOpen(false);
  }
  const set = (k: keyof FormValues) => (v: string) => setValues((x) => ({ ...x, [k]: v }));
  const changeStatus = (id: string, s: PostingStatus) => {
    setPostingStatus(id, s);
    setChanged(true);
    toast.success(p.statusChanged);
  };

  return (
    <>
      <DataGrid
        data={rows}
        columns={columns}
        caption={p.title}
        searchLabel={p.searchLabel}
        searchPlaceholder={p.searchLabel}
        toolbar={
          <Button className="sm:ml-auto" onClick={() => setFormOpen(true)}>
            <FilePlus2 data-icon="inline-start" aria-hidden /> {t.postCta}
          </Button>
        }
      />

      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current?.title ?? ""}>
        {current && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <StatusPill status={current.status} />
              {current.location} · {current.mode}
            </div>
            <p>{current.description}</p>
            <ul className="flex flex-wrap gap-1.5">
              {current.skills.map((s) => (
                <li key={s}>
                  <Badge variant="outline">{s}</Badge>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 border-t pt-5">
              {current.status === "open" && (
                <Button variant="outline" onClick={() => changeStatus(current.id, "closed")}>
                  {p.close}
                </Button>
              )}
              {current.status === "closed" && <Button onClick={() => changeStatus(current.id, "open")}>{p.reopen}</Button>}
              {current.status === "draft" && <Button onClick={() => changeStatus(current.id, "open")}>{p.publish}</Button>}
            </div>
            {changed && (
              <Alert variant="success" role="status">
                <CheckCircle2 aria-hidden />
                <AlertDescription>{p.statusChanged}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DetailDrawer>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit("open");
            }}
            className="grid gap-5"
          >
            <DialogHeader>
              <DialogTitle>{f.title}</DialogTitle>
              <DialogDescription className="flex items-start gap-2">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {f.prototype}
              </DialogDescription>
            </DialogHeader>
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
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                {f.cancel}
              </Button>
              <Button type="button" variant="outline" onClick={() => submit("draft")}>
                {f.asDraft}
              </Button>
              <Button type="submit">{f.publish}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------- Applicants ----------

type ApplicantRow = CompanyApplicant & { name: string; discipline: string; role: string };

export function ApplicantsView() {
  const { applicants, postings, setStage, ready } = useCompanyData();
  const a = t.applicantsPage;
  const [role, setRole] = useState(ANY);
  const [stageFilter, setStageFilter] = useState(ANY);
  const [openId, setOpenId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const rows: ApplicantRow[] = applicants
    .filter((x) => (role === ANY || x.postingId === role) && (stageFilter === ANY || x.stage === stageFilter))
    .map((x) => {
      const p = talentById(x.talentId);
      return { ...x, name: p.name, discipline: p.discipline, role: postings.find((y) => y.id === x.postingId)?.title ?? "" };
    });
  const current = applicants.find((x) => x.id === openId) as CompanyApplicant | undefined;
  const sessionApp = applicants.some((x) => x.fromSession);

  const columns = useMemo<ColumnDef<ApplicantRow, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: a.columns.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <TalentAvatar name={row.original.name} />
            <span>
              <span className="block font-medium text-heading">{row.original.name}</span>
              <span className="block text-xs text-muted-foreground">{row.original.discipline}</span>
            </span>
          </div>
        ),
      },
      { accessorKey: "role", header: a.columns.role },
      { accessorKey: "stage", header: a.columns.stage, cell: ({ row }) => <StagePill stage={row.original.stage} />, enableGlobalFilter: false },
      {
        accessorKey: "appliedDaysAgo",
        header: ({ column }) => <SortHeader label={a.columns.applied} sorted={column.getIsSorted()} onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
        cell: ({ row }) => (row.original.fromSession ? a.thisSession : ago(row.original.appliedDaysAgo)),
        enableGlobalFilter: false,
      },
      {
        id: "action",
        header: () => <span className="sr-only">{t.recentApplicants.review}</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="navy"
              size="sm"
              onClick={() => {
                setOpenId(row.original.id);
                setSaved(false);
              }}
            >
              {t.recentApplicants.review}
              <span className="sr-only">: {row.original.name}</span>
            </Button>
          </div>
        ),
      },
    ],
    [a],
  );

  return (
    <div className="space-y-6">
      {ready && !sessionApp && (
        <Alert>
          <Info aria-hidden />
          <AlertDescription>{a.hint}</AlertDescription>
        </Alert>
      )}
      <DataGrid
        data={rows}
        columns={columns}
        caption={a.title}
        searchLabel={a.searchLabel}
        searchPlaceholder={a.searchLabel}
        emptyTitle={a.empty.title}
        emptyBody={a.empty.body}
        toolbar={
          <>
            <ToolbarSelect label={a.role} value={role} onChange={setRole} options={[{ value: ANY, label: a.allRoles }, ...postings.map((p) => ({ value: p.id, label: p.title }))]} />
            <ToolbarSelect
              label={a.columns.stage}
              value={stageFilter}
              onChange={setStageFilter}
              options={[{ value: ANY, label: a.allStages }, ...stages.map((s) => ({ value: s, label: a.stages[s] }))]}
            />
          </>
        }
      />
      <p className="text-xs text-muted-foreground">{a.note}</p>

      <DetailDrawer open={!!current} onClose={() => setOpenId(null)} title={current ? talentById(current.talentId).name : ""}>
        {current && (
          <div className="space-y-5 text-sm">
            <p className="text-muted-foreground">
              {postings.find((y) => y.id === current.postingId)?.title} · {current.fromSession ? a.thisSession : ago(current.appliedDaysAgo)}
            </p>
            <FilterSelect
              id="move-stage"
              label={a.moveTo}
              value={current.stage}
              onChange={(v) => {
                setStage(current.id, v as Stage);
                setSaved(true);
                toast.success(a.stageSaved);
              }}
              options={stages.map((s) => ({ value: s, label: a.stages[s] }))}
            />
            {saved && (
              <Alert variant="success" role="status">
                <CheckCircle2 aria-hidden />
                <AlertDescription>{a.stageSaved}</AlertDescription>
              </Alert>
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
      className="space-y-3 rounded-lg border p-4"
    >
      <TextArea
        id="msg-applicant"
        label={m.companyAction.replace("{name}", name)}
        value={text}
        onChange={(v) => {
          setText(v);
          setError("");
          setSent(false);
        }}
        error={error}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="navy">
          {m.send}
        </Button>
        <p role="status" className="text-sm font-medium text-primary">
          {sent ? m.companySent.replace("{name}", name) : ""}
        </p>
      </div>
    </form>
  );
}
