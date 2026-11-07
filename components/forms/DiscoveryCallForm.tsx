"use client";

import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ErrorSummary, RadioGroup, SelectField, TextArea, TextField } from "@/components/forms/Fields";
import { discoveryCall as t, formText } from "@/content/pages";
import { fakeNetwork, isEmail, saveToSession } from "@/lib/prototypeStore";

/*
  Discovery-call request: the placeholder booking step until Bridge chooses a booking tool.
  Prototype: nothing is sent; the request is kept in this tab.
*/

type Values = { fullName: string; email: string; organisation: string; role: string; topic: string; date: string; time: string };
const empty: Values = { fullName: "", email: "", organisation: "", role: "", topic: "", date: "", time: "" };

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function validate(v: Values) {
  const e: Record<string, string> = {};
  if (!v.fullName.trim()) e.fullName = formText.required;
  if (!v.email.trim()) e.email = formText.required;
  else if (!isEmail(v.email)) e.email = formText.email;
  if (!v.role) e.role = formText.required;
  if (!v.topic.trim()) e.topic = formText.required;
  if (!v.date) e.date = formText.required;
  else if (v.date < tomorrow()) e.date = formText.date;
  if (!v.time) e.time = formText.required;
  return e;
}

export function DiscoveryCallForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  // The earliest bookable date depends on today, so it's worked out in the browser.
  const [minDate, setMinDate] = useState<string | undefined>();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- needs the visitor's clock, after mount
  useEffect(() => setMinDate(tomorrow()), []);

  const set = <K extends keyof Values>(key: K) => (val: Values[K]) => {
    const next = { ...values, [key]: val };
    setValues(next);
    if (submitted) setErrors(validate(next));
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
    saveToSession("bridge-discovery-calls", values);
    setStatus("done");
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (status === "done") {
    return (
      <div className="rounded-card border border-green-700 bg-green-50 p-6 md:p-8" role="status">
        <CheckCircle2 aria-hidden className="size-8 text-green-700" />
        <h2 ref={successRef} tabIndex={-1} className="mt-4 text-h3 text-navy-900 focus:outline-none">
          {t.success.title}
        </h2>
        <p className="mt-2 text-gray-800">{t.success.body}</p>
      </div>
    );
  }

  // Error-summary labels: the text fields only (not the option lists).
  const labels: Record<string, string> = Object.fromEntries(
    Object.entries(t.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );

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
      </div>
      <TextField id="organisation" label={t.fields.organisation} value={values.organisation} onChange={set("organisation")} autoComplete="organization" />
      <RadioGroup id="role" label={t.fields.role} required value={values.role} onChange={set("role")} options={t.fields.roles} error={errors.role} />
      <TextArea id="topic" label={t.fields.topic} required value={values.topic} onChange={set("topic")} error={errors.topic} />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField id="date" type="date" label={t.fields.date} required min={minDate} value={values.date} onChange={set("date")} error={errors.date} />
        <SelectField id="time" label={t.fields.time} required value={values.time} onChange={set("time")} options={t.fields.times} placeholder={formText.choose} error={errors.time} />
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
