"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ErrorSummary, RadioGroup, SelectField, TextArea, TextField } from "@/components/forms/Fields";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { discoveryCall as t, formText } from "@/content/pages";
import { fakeNetwork, isEmail, saveToSession } from "@/lib/prototypeStore";

/*
  Discovery-call request on react-hook-form + zod: the placeholder booking step until Bridge
  chooses a booking tool. Prototype: nothing is sent; the request is kept in this tab.
*/

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const required = (extra?: (v: string) => string | undefined) =>
  z.string().superRefine((v, ctx) => {
    if (!v.trim()) ctx.addIssue({ code: "custom", message: formText.required });
    else {
      const problem = extra?.(v.trim());
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    }
  });

const schema = z.object({
  fullName: required(),
  email: required((v) => (isEmail(v) ? undefined : formText.email)),
  organisation: z.string(),
  role: required(),
  topic: required(),
  date: required((v) => (v < tomorrow() ? formText.date : undefined)),
  time: required(),
});
type Values = z.infer<typeof schema>;

const empty: Values = { fullName: "", email: "", organisation: "", role: "", topic: "", date: "", time: "" };

export function DiscoveryCallForm() {
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  // The earliest bookable date depends on today, so it's worked out in the browser.
  const [minDate, setMinDate] = useState<string | undefined>();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- needs the visitor's clock, after mount
  useEffect(() => setMinDate(tomorrow()), []);

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: empty, shouldFocusError: false, reValidateMode: "onChange" });
  const { control, formState } = form;

  // After a failed submit, move focus to the error summary once it has rendered.
  const failedSubmits = formState.submitCount - (formState.isSubmitSuccessful ? 1 : 0);
  useEffect(() => {
    if (failedSubmits > 0) summaryRef.current?.focus();
  }, [failedSubmits]);

  async function onValid(values: Values) {
    await fakeNetwork();
    saveToSession("bridge-discovery-calls", values);
    toast.success(t.success.title);
    setDone(true);
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (done) {
    return (
      <Alert variant="success" className="p-6 md:p-8" role="status">
        <CheckCircle2 className="size-6!" />
        <AlertTitle className="text-lg">
          <h2 ref={successRef} tabIndex={-1} className="font-semibold text-heading focus:outline-none">
            {t.success.title}
          </h2>
        </AlertTitle>
        <AlertDescription className="text-base">{t.success.body}</AlertDescription>
      </Alert>
    );
  }

  // Error-summary labels: the text fields only (not the option lists).
  const labels: Record<string, string> = Object.fromEntries(Object.entries(t.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  const errors = Object.fromEntries(Object.entries(formState.errors).map(([k, v]) => [k, v?.message ?? ""])) as Record<string, string>;
  const submitting = formState.isSubmitting;

  return (
    <form noValidate onSubmit={(e) => form.handleSubmit(onValid)(e)} className="space-y-6">
      <Alert role="note">
        <Info />
        <AlertDescription>{t.prototypeNote}</AlertDescription>
      </Alert>
      {formState.isSubmitted && <ErrorSummary title={formText.errorSummaryTitle} errors={errors} labels={labels} summaryRef={summaryRef} />}
      <div className="grid gap-6 md:grid-cols-2">
        <Controller name="fullName" control={control} render={({ field }) => <TextField id="fullName" label={t.fields.fullName} required value={field.value} onChange={field.onChange} error={errors.fullName} autoComplete="name" />} />
        <Controller name="email" control={control} render={({ field }) => <TextField id="email" type="email" label={t.fields.email} required value={field.value} onChange={field.onChange} error={errors.email} autoComplete="email" />} />
      </div>
      <Controller name="organisation" control={control} render={({ field }) => <TextField id="organisation" label={t.fields.organisation} value={field.value} onChange={field.onChange} autoComplete="organization" />} />
      <Controller name="role" control={control} render={({ field }) => <RadioGroup id="role" label={t.fields.role} required value={field.value} onChange={field.onChange} options={t.fields.roles} error={errors.role} />} />
      <Controller name="topic" control={control} render={({ field }) => <TextArea id="topic" label={t.fields.topic} required value={field.value} onChange={field.onChange} error={errors.topic} />} />
      <div className="grid gap-6 md:grid-cols-2">
        <Controller name="date" control={control} render={({ field }) => <TextField id="date" type="date" label={t.fields.date} required min={minDate} value={field.value} onChange={field.onChange} error={errors.date} />} />
        <Controller
          name="time"
          control={control}
          render={({ field }) => <SelectField id="time" label={t.fields.time} required value={field.value} onChange={field.onChange} options={t.fields.times} placeholder={formText.choose} error={errors.time} />}
        />
      </div>
      <Button type="submit" size="xl" disabled={submitting}>
        {submitting && <Spinner data-icon="inline-start" />}
        {submitting ? t.submitting : t.submit}
      </Button>
      <p aria-live="polite" className="sr-only">
        {submitting ? t.submitting : ""}
      </p>
    </form>
  );
}
