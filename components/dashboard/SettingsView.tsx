"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ResetDemo } from "@/components/ResetDemo";
import { Panel } from "@/components/dashboard/parts";
import { CheckboxField, ErrorSummary, RadioGroup, TextArea, TextField } from "@/components/forms/Fields";
import { settingsText as t } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { school } from "@/data/school";
import { talentProfiles } from "@/data/talent";
import { sampleUsers, type Role } from "@/data/users";
import { defaultPrivacy, PRIVACY_STORE, readStudentPrivacy, type StudentPrivacy } from "@/lib/privacy";
import { isEmail, readJSON } from "@/lib/prototypeStore";

/*
  Settings for all four roles (Checkpoint 13; shadcn controls since redesign Step 7): profile, email notifications and one
  role-specific panel. For the student, Skills Passport privacy really changes what companies
  and the public link show. Everything is kept in this browser tab.
*/

type Base = { name: string; email: string; phone: string; notify: boolean[] };

function SwitchRow({ id, label, help, checked, onChange }: { id: string; label: string; help?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Field orientation="horizontal" className="justify-between gap-6 border-b py-4 first:pt-0 last:border-0 last:pb-0">
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {help && <FieldDescription id={`${id}-help`}>{help}</FieldDescription>}
      </FieldContent>
      <Switch id={id} checked={checked} aria-describedby={help ? `${id}-help` : undefined} onCheckedChange={onChange} />
    </Field>
  );
}

export function SettingsView({ role }: { role: Role }) {
  const user = sampleUsers[role];
  const key = `bridge-settings-${role}`;
  const notifyLabels = t.notifications[role];
  const diane = talentProfiles.find((p) => p.id === "sample-1")!;

  const [base, setBase] = useState<Base>({ name: user.name, email: t.sampleEmail[role], phone: "", notify: notifyLabels.map(() => true) });
  const [extra, setExtra] = useState<Record<string, string | boolean | string[]>>({
    requireEvidence: true,
    whoVerifies: t.school.whoOptions[0],
    website: "https://sample-tech.example",
    about: "A software company building tools for small businesses in Rwanda. (Sample company.)",
    disciplines: ["Software Development", "Internet Technologies"],
  });
  const [privacy, setPrivacy] = useState<StudentPrivacy>(defaultPrivacy(diane));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only storage, read once after mount */
    const stored = readJSON<{ base?: Base; extra?: typeof extra } | null>(key, null);
    if (stored?.base) setBase(stored.base);
    if (stored?.extra) setExtra(stored.extra);
    if (role === "student") setPrivacy(readStudentPrivacy(defaultPrivacy(diane)));
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, role]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!base.name.trim()) er["set-name"] = formText.required;
    if (!base.email.trim()) er["set-email"] = formText.required;
    else if (!isEmail(base.email)) er["set-email"] = formText.email;
    setErrors(er);
    setSaved(false);
    if (Object.keys(er).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    try {
      sessionStorage.setItem(key, JSON.stringify({ base, extra }));
      if (role === "student") sessionStorage.setItem(PRIVACY_STORE, JSON.stringify(privacy));
    } catch {}
    setSaved(true);
    toast.success(t.saved);
  }

  const toggleList = (name: string, value: string) => {
    const list = (extra[name] as string[]) ?? [];
    setExtra({ ...extra, [name]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] });
  };

  return (
    <form noValidate onSubmit={save} className="space-y-6">
      <ErrorSummary title={formText.errorSummaryTitle} errors={errors} labels={{ "set-name": t.profile.name, "set-email": t.profile.email }} summaryRef={summaryRef} />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Panel title={t.profile.title} id="set-profile">
          <div className="space-y-5">
            <TextField id="set-name" label={t.profile.name} required value={base.name} onChange={(v) => setBase({ ...base, name: v })} error={errors["set-name"]} autoComplete="name" />
            <TextField id="set-email" type="email" label={t.profile.email} required value={base.email} onChange={(v) => setBase({ ...base, email: v })} error={errors["set-email"]} autoComplete="email" />
            <TextField id="set-phone" type="tel" label={t.profile.phone} value={base.phone} onChange={(v) => setBase({ ...base, phone: v })} autoComplete="tel" />
          </div>
        </Panel>

        <Panel title={t.notificationsTitle} id="set-notify">
          {notifyLabels.map((label, i) => (
            <SwitchRow
              key={label}
              id={`notify-${i}`}
              label={label}
              checked={base.notify[i] ?? true}
              onChange={(v) => setBase({ ...base, notify: base.notify.map((x, j) => (j === i ? v : x)) })}
            />
          ))}
        </Panel>

        {role === "student" && (
          <Panel title={t.privacy.title} subtitle={t.privacy.description} id="set-privacy">
            <SwitchRow id="priv-link" label={t.privacy.publicLink} help={t.privacy.publicLinkHelp} checked={privacy.publicLink} onChange={(v) => setPrivacy({ ...privacy, publicLink: v })} />
            <SwitchRow
              id="priv-availability"
              label={t.privacy.shareAvailability}
              help={t.privacy.shareAvailabilityHelp}
              checked={privacy.shareAvailability}
              onChange={(v) => setPrivacy({ ...privacy, shareAvailability: v })}
            />
            {privacy.shareAvailability && (
              <div className="pt-4">
                <TextField id="priv-text" label={t.privacy.availabilityText} value={privacy.availabilityText} onChange={(v) => setPrivacy({ ...privacy, availabilityText: v })} />
              </div>
            )}
          </Panel>
        )}

        {role === "school" && (
          <Panel title={t.school.title} subtitle={school.name} id="set-school">
            <SwitchRow id="req-evidence" label={t.school.requireEvidence} checked={!!extra.requireEvidence} onChange={(v) => setExtra({ ...extra, requireEvidence: v })} />
            <div className="pt-4">
              <RadioGroup id="who" label={t.school.whoVerifies} value={String(extra.whoVerifies)} onChange={(v) => setExtra({ ...extra, whoVerifies: v })} options={t.school.whoOptions} />
            </div>
          </Panel>
        )}

        {role === "company" && (
          <Panel title={t.company.title} id="set-company">
            <div className="space-y-5">
              <TextField id="co-web" label={t.company.website} value={String(extra.website)} onChange={(v) => setExtra({ ...extra, website: v })} />
              <TextArea id="co-about" label={t.company.about} value={String(extra.about)} onChange={(v) => setExtra({ ...extra, about: v })} />
              <FieldSet>
                <FieldLegend variant="label">{t.company.disciplines}</FieldLegend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {school.disciplines.map((d, i) => (
                    <CheckboxField key={d} id={`co-disc-${i}`} label={d} checked={((extra.disciplines as string[]) ?? []).includes(d)} onChange={() => toggleList("disciplines", d)} />
                  ))}
                </div>
              </FieldSet>
            </div>
          </Panel>
        )}

        {role === "admin" && (
          <Panel title={t.admin.title} id="set-admin">
            <div className="space-y-1 text-sm">
              <p className="font-medium text-heading">{t.admin.prototypeMode}</p>
              <p>{t.admin.prototypeOn}</p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" /> {t.admin.prototypeHow}
              </p>
            </div>
            <div className="mt-6">
              <ResetDemo />
            </div>
          </Panel>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg">
          {t.save}
        </Button>
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-primary">
          {saved && (
            <>
              <CheckCircle2 aria-hidden className="size-4" /> {t.saved}
            </>
          )}
        </p>
      </div>
    </form>
  );
}
