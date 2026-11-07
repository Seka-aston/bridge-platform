"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { CheckboxField, ErrorSummary, SelectField, TextArea, TextField } from "@/components/forms/Fields";
import { applyForm as t, formText } from "@/content/pages";
import { fakeNetwork, isEmail, readSession, saveToSession } from "@/lib/prototypeStore";

/*
  Programme application (spec 4.2.15: validation, loading state, success message,
  actionable errors). Prototype: nothing is sent; the application is kept in this tab.
*/

const STORE = "bridge-applications";

type Values = {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  discipline: string;
  level: string;
  motivation: string;
  confirm: boolean;
  understand: boolean;
};

const empty: Values = {
  fullName: "",
  email: "",
  phone: "",
  school: "",
  discipline: "",
  level: "",
  motivation: "",
  confirm: false,
  understand: false,
};

function validate(v: Values) {
  const e: Record<string, string> = {};
  if (!v.fullName.trim()) e.fullName = formText.required;
  if (!v.email.trim()) e.email = formText.required;
  else if (!isEmail(v.email)) e.email = formText.email;
  if (!v.school.trim()) e.school = formText.required;
  if (!v.discipline) e.discipline = formText.required;
  if (!v.level) e.level = formText.required;
  if (!v.motivation.trim()) e.motivation = formText.required;
  else if (v.motivation.trim().length < 20) e.motivation = formText.tooShort;
  if (!v.confirm) e.confirm = formText.mustConfirm;
  if (!v.understand) e.understand = formText.mustConfirm;
  return e;
}

export function ApplyForm({ programmeId, programmeName }: { programmeId: string; programmeName: string }) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // If this tab already applied to this programme during the demo, show the confirmation.
  useEffect(() => {
    const already = readSession<{ programmeId: string }>(STORE).some((a) => a.programmeId === programmeId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage after mount
    if (already) setStatus("done");
  }, [programmeId]);

  const set = <K extends keyof Values>(key: K) => (val: Values[K]) => {
    const next = { ...values, [key]: val };
    setValues(next);
    if (submitted) setErrors(validate(next)); // re-check as people fix things
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("submitting");
    await fakeNetwork();
    saveToSession(STORE, { programmeId, programmeName, ...values });
    setStatus("done");
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (status === "done") {
    return (
      <div className="rounded-card border border-green-700 bg-green-50 p-6 md:p-8" role="status">
        <CheckCircle2 aria-hidden className="size-8 text-green-700" />
        <h3 ref={successRef} tabIndex={-1} className="mt-4 text-h3 text-navy-900 focus:outline-none">
          {t.success.title}
        </h3>
        <p className="mt-2 text-gray-800">{t.success.body}</p>
        <p className="mt-4 flex items-start gap-2 text-gray-700">
          <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
          {t.success.prototype}
        </p>
      </div>
    );
  }

  const labels = { ...t.fields } as Record<string, string>;

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <p className="flex items-start gap-2 rounded-control border border-dashed border-gray-500 bg-white px-4 py-3 text-gray-700">
        <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
        {t.prototypeNote}
      </p>
      <ErrorSummary title={formText.errorSummaryTitle} errors={errors} labels={labels} summaryRef={summaryRef} />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField id="fullName" label={t.fields.fullName} required value={values.fullName} onChange={set("fullName")} error={errors.fullName} autoComplete="name" />
        <TextField id="email" type="email" label={t.fields.email} required value={values.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <TextField id="phone" type="tel" label={t.fields.phone} value={values.phone} onChange={set("phone")} autoComplete="tel" />
        <TextField id="school" label={t.fields.school} required value={values.school} onChange={set("school")} error={errors.school} />
        <SelectField id="discipline" label={t.fields.discipline} required value={values.discipline} onChange={set("discipline")} options={t.disciplines} placeholder={formText.choose} error={errors.discipline} />
        <SelectField id="level" label={t.fields.level} required value={values.level} onChange={set("level")} options={t.levels} placeholder={formText.choose} error={errors.level} />
      </div>
      <TextArea id="motivation" label={t.fields.motivation} required value={values.motivation} onChange={set("motivation")} error={errors.motivation} />
      <div className="space-y-4">
        <CheckboxField id="confirm" label={t.fields.confirm} checked={values.confirm} onChange={set("confirm")} error={errors.confirm} />
        <CheckboxField id="understand" label={t.fields.understand} checked={values.understand} onChange={set("understand")} error={errors.understand} />
      </div>
      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? t.submitting : t.submit}
      </Button>
      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? t.submitting : ""}
      </p>
    </form>
  );
}
