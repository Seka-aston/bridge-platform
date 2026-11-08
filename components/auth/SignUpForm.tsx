"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OrDivider, SocialButtons } from "@/components/auth/SocialButtons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { authText } from "@/content/auth";
import { roleText } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { fakeNetwork, isEmail } from "@/lib/prototypeStore";

/*
  Create an account (simulated). Validates like a real sign-up, then explains that new accounts
  aren't saved in the prototype and offers the matching sample dashboard.
*/

const t = authText.signUp;
const joinRoles = ["student", "school", "company"] as const;

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
  password: required((v) => (v.length < 8 ? t.passwordShort : undefined)),
  role: z.enum(joinRoles),
  agree: z.boolean().refine((v) => v, formText.mustConfirm),
});
type Values = z.infer<typeof schema>;

const link = "rounded-sm font-medium text-link underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SignUpForm() {
  const [created, setCreated] = useState<Values["role"] | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { fullName: "", email: "", password: "", role: "student", agree: false }, reValidateMode: "onChange" });
  const busy = form.formState.isSubmitting;

  useEffect(() => {
    if (created) doneRef.current?.focus();
  }, [created]);

  async function onValid(v: Values) {
    await fakeNetwork();
    setCreated(v.role);
  }

  if (created) {
    const label = roleText[created].label;
    return (
      <div ref={doneRef} tabIndex={-1} className="space-y-6 focus:outline-none">
        <Alert variant="success" role="status">
          <CheckCircle2 />
          <AlertTitle className="font-semibold text-heading">{t.success.title}</AlertTitle>
          <AlertDescription>{t.success.body.replace("{role}", label)}</AlertDescription>
        </Alert>
        <Button asChild size="lg" className="w-full text-base">
          <Link href={`/dashboard/${created}`}>{t.success.cta.replace("{role}", label)}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <SocialButtons />
      <OrDivider label={t.divider} />
      <form noValidate onSubmit={(e) => form.handleSubmit(onValid)(e)}>
        <FieldGroup className="gap-5">
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="su-name">{t.fullName}</FieldLabel>
                <Input {...field} id="su-name" autoComplete="name" className="h-11 text-base" aria-invalid={fieldState.invalid} aria-describedby={fieldState.invalid ? "su-name-error" : undefined} />
                {fieldState.invalid && <FieldError id="su-name-error" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="su-email">{t.email}</FieldLabel>
                <Input {...field} id="su-email" type="email" autoComplete="email" className="h-11 text-base" aria-invalid={fieldState.invalid} aria-describedby={fieldState.invalid ? "su-email-error" : undefined} />
                {fieldState.invalid && <FieldError id="su-email-error" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="su-password">{t.password}</FieldLabel>
                <PasswordInput
                  {...field}
                  id="su-password"
                  autoComplete="new-password"
                  showLabel={authText.login.showPassword}
                  hideLabel={authText.login.hidePassword}
                  className="h-11 [&_input]:text-base"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "su-password-error su-password-hint" : "su-password-hint"}
                />
                <FieldDescription id="su-password-hint">{t.passwordHint}</FieldDescription>
                {fieldState.invalid && <FieldError id="su-password-error" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <FieldSet>
                <FieldLegend variant="label">{t.role}</FieldLegend>
                <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange} className="gap-2">
                  {joinRoles.map((r) => (
                    <FieldLabel key={r} htmlFor={`su-role-${r}`}>
                      <Field orientation="horizontal">
                        <RadioGroupItem value={r} id={`su-role-${r}`} aria-labelledby={`su-role-${r}-text`} />
                        <span id={`su-role-${r}-text`} className="font-normal">
                          {t.roles[r]}
                        </span>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FieldSet>
            )}
          />
          <Controller
            name="agree"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  id="su-agree"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  ref={field.ref}
                  className="mt-0.5"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "su-agree-error" : undefined}
                />
                <FieldContent>
                  <FieldLabel htmlFor="su-agree" className="font-normal">
                    {t.agree}
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    <Link href={t.agreeLinks.terms.href} className={link}>
                      {t.agreeLinks.terms.label}
                    </Link>{" "}
                    ·{" "}
                    <Link href={t.agreeLinks.privacy.href} className={link}>
                      {t.agreeLinks.privacy.label}
                    </Link>
                  </p>
                  {fieldState.invalid && <FieldError id="su-agree-error" errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
          <Button type="submit" size="lg" className="w-full text-base" disabled={busy}>
            {busy && <Spinner data-icon="inline-start" />}
            {busy ? t.submitting : t.submit}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
