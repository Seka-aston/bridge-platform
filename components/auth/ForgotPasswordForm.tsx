"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authText } from "@/content/auth";
import { formText } from "@/content/pages";
import { fakeNetwork, isEmail } from "@/lib/prototypeStore";

// Password reset request (simulated): always gives the same answer, so it never reveals whether an account exists.
const t = authText.forgot;

const schema = z.object({
  email: z.string().superRefine((v, ctx) => {
    if (!v.trim()) ctx.addIssue({ code: "custom", message: formText.required });
    else if (!isEmail(v.trim())) ctx.addIssue({ code: "custom", message: formText.email });
  }),
});

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const form = useForm<{ email: string }>({ resolver: zodResolver(schema), defaultValues: { email: "" }, reValidateMode: "onChange" });
  const busy = form.formState.isSubmitting;

  useEffect(() => {
    if (sentTo) doneRef.current?.focus();
  }, [sentTo]);

  if (sentTo) {
    return (
      <Alert ref={doneRef} tabIndex={-1} variant="success" role="status" className="focus:outline-none">
        <MailCheck />
        <AlertDescription className="space-y-2 text-foreground">
          <p>{t.success.replace("{email}", sentTo)}</p>
          <p className="text-muted-foreground">{t.prototype}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) =>
        form.handleSubmit(async (v) => {
          await fakeNetwork();
          setSentTo(v.email.trim());
        })(e)
      }
    >
      <FieldGroup className="gap-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fp-email">{t.email}</FieldLabel>
              <Input {...field} id="fp-email" type="email" autoComplete="email" className="h-11 text-base" aria-invalid={fieldState.invalid} aria-describedby={fieldState.invalid ? "fp-email-error" : undefined} />
              {fieldState.invalid && <FieldError id="fp-email-error" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" size="lg" className="w-full text-base" disabled={busy}>
          {busy && <Spinner data-icon="inline-start" />}
          {busy ? t.submitting : t.submit}
        </Button>
      </FieldGroup>
    </form>
  );
}
