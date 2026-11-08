"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CheckboxField, ErrorSummary, SelectField, TextArea, TextField } from "@/components/forms/Fields";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { noticeText } from "@/content/dashboard";
import { applyForm as t, formText } from "@/content/pages";
import { addNotice, fakeNetwork, isEmail, readSession, saveToSession } from "@/lib/prototypeStore";

/*
  Programme application (spec 4.2.15: validation, loading state, success message, actionable
  errors), on react-hook-form + zod. Prototype: nothing is sent; the application is kept in
  this browser tab, and the school and admin dashboards get a notice.
*/

const STORE = "bridge-applications";

// Required text with an extra rule once something has been typed.
const requiredText = (extra?: (v: string) => string | undefined) =>
  z.string().superRefine((v, ctx) => {
    if (!v.trim()) ctx.addIssue({ code: "custom", message: formText.required });
    else {
      const problem = extra?.(v.trim());
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    }
  });

const schema = z.object({
  fullName: requiredText(),
  email: requiredText((v) => (isEmail(v) ? undefined : formText.email)),
  phone: z.string(),
  school: requiredText(),
  discipline: requiredText(),
  level: requiredText(),
  motivation: requiredText((v) => (v.length < 20 ? formText.tooShort : undefined)),
  confirm: z.boolean().refine((v) => v, formText.mustConfirm),
  understand: z.boolean().refine((v) => v, formText.mustConfirm),
});
type Values = z.infer<typeof schema>;

const empty: Values = { fullName: "", email: "", phone: "", school: "", discipline: "", level: "", motivation: "", confirm: false, understand: false };

export function ApplyForm({ programmeId, programmeName }: { programmeId: string; programmeName: string }) {
  const [done, setDone] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: empty, shouldFocusError: false, reValidateMode: "onChange" });
  const { control, formState } = form;

  // If this tab already applied to this programme during the demo, show the confirmation.
  useEffect(() => {
    const already = readSession<{ programmeId: string }>(STORE).some((a) => a.programmeId === programmeId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage after mount
    if (already) setDone(true);
  }, [programmeId]);

  async function onValid(values: Values) {
    await fakeNetwork();
    saveToSession(STORE, { programmeId, programmeName, ...values });
    const notice = noticeText.programmeApplied.replace("{name}", values.fullName.trim()).replace("{programme}", programmeName);
    addNotice("school", notice);
    addNotice("admin", notice);
    toast.success(t.success.title, { description: t.success.body });
    setDone(true);
    requestAnimationFrame(() => successRef.current?.focus());
  }

  // After a failed submit, move focus to the error summary (once it has rendered) so
  // screen-reader users hear the problems.
  const failedSubmits = formState.submitCount - (formState.isSubmitSuccessful ? 1 : 0);
  useEffect(() => {
    if (failedSubmits > 0) summaryRef.current?.focus();
  }, [failedSubmits]);

  if (done) {
    return (
      <Alert variant="success" className="p-6 md:p-8" role="status">
        <CheckCircle2 className="size-6!" />
        <AlertTitle className="text-lg">
          <h3 ref={successRef} tabIndex={-1} className="font-semibold text-heading focus:outline-none">
            {t.success.title}
          </h3>
        </AlertTitle>
        <AlertDescription className="space-y-3 text-base">
          <p>{t.success.body}</p>
          <p className="text-muted-foreground">{t.success.prototype}</p>
        </AlertDescription>
      </Alert>
    );
  }

  const errors = Object.fromEntries(Object.entries(formState.errors).map(([k, v]) => [k, v?.message ?? ""])) as Record<string, string>;
  const submitting = formState.isSubmitting;

  return (
    <form noValidate onSubmit={(e) => form.handleSubmit(onValid)(e)} className="space-y-6">
      <Alert role="note">
        <Info />
        <AlertDescription>{t.prototypeNote}</AlertDescription>
      </Alert>
      {formState.isSubmitted && <ErrorSummary title={formText.errorSummaryTitle} errors={errors} labels={t.fields as Record<string, string>} summaryRef={summaryRef} />}
      <div className="grid gap-6 md:grid-cols-2">
        <Controller name="fullName" control={control} render={({ field }) => <TextField id="fullName" label={t.fields.fullName} required value={field.value} onChange={field.onChange} error={errors.fullName} autoComplete="name" />} />
        <Controller name="email" control={control} render={({ field }) => <TextField id="email" type="email" label={t.fields.email} required value={field.value} onChange={field.onChange} error={errors.email} autoComplete="email" />} />
        <Controller name="phone" control={control} render={({ field }) => <TextField id="phone" type="tel" label={t.fields.phone} value={field.value} onChange={field.onChange} autoComplete="tel" />} />
        <Controller name="school" control={control} render={({ field }) => <TextField id="school" label={t.fields.school} required value={field.value} onChange={field.onChange} error={errors.school} />} />
        <Controller
          name="discipline"
          control={control}
          render={({ field }) => <SelectField id="discipline" label={t.fields.discipline} required value={field.value} onChange={field.onChange} options={t.disciplines} placeholder={formText.choose} error={errors.discipline} />}
        />
        <Controller
          name="level"
          control={control}
          render={({ field }) => <SelectField id="level" label={t.fields.level} required value={field.value} onChange={field.onChange} options={t.levels} placeholder={formText.choose} error={errors.level} />}
        />
      </div>
      <Controller name="motivation" control={control} render={({ field }) => <TextArea id="motivation" label={t.fields.motivation} required value={field.value} onChange={field.onChange} error={errors.motivation} />} />
      <div className="space-y-4">
        <Controller name="confirm" control={control} render={({ field }) => <CheckboxField id="confirm" label={t.fields.confirm} checked={field.value} onChange={field.onChange} error={errors.confirm} />} />
        <Controller name="understand" control={control} render={({ field }) => <CheckboxField id="understand" label={t.fields.understand} checked={field.value} onChange={field.onChange} error={errors.understand} />} />
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
