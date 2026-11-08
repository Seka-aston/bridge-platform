"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OrDivider, SocialButtons } from "@/components/auth/SocialButtons";
import { ResetDemo } from "@/components/ResetDemo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authText } from "@/content/auth";
import { roleText } from "@/content/dashboard";
import { formText } from "@/content/pages";
import { roleForEmail, roles, sampleUsers } from "@/data/users";
import { isEmail } from "@/lib/prototypeStore";

/*
  Log in (prototype). Social buttons, then email and password. The four sample users' emails
  open their dashboards with any password; any other email gets a clear "no account" message.
*/

const t = authText.login;

const schema = z.object({
  email: z.string().superRefine((v, ctx) => {
    if (!v.trim()) ctx.addIssue({ code: "custom", message: formText.required });
    else if (!isEmail(v.trim())) ctx.addIssue({ code: "custom", message: formText.email });
  }),
  password: z.string().min(1, t.passwordRequired),
});
type Values = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" }, reValidateMode: "onChange" });
  const busy = form.formState.isSubmitting || leaving;

  async function onValid(v: Values) {
    const role = roleForEmail(v.email);
    if (!role) {
      form.setError("email", { message: t.noAccount }, { shouldFocus: true });
      return;
    }
    await new Promise((r) => setTimeout(r, 800));
    setLeaving(true);
    router.push(`/dashboard/${role}`);
  }

  return (
    <div>
      <SocialButtons onBusy={setLeaving} />
      <OrDivider label={t.divider} />
      <form noValidate onSubmit={(e) => form.handleSubmit(onValid)(e)}>
        <FieldGroup className="gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">{t.email}</FieldLabel>
                <Input {...field} id="login-email" type="email" autoComplete="email" className="h-11 text-base" aria-invalid={fieldState.invalid} aria-describedby={fieldState.invalid ? "login-email-error" : undefined} />
                {fieldState.invalid && <FieldError id="login-email-error" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="login-password">{t.password}</FieldLabel>
                  <Link href="/forgot-password" className="rounded-sm text-sm text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    {t.forgot}
                  </Link>
                </div>
                <PasswordInput
                  {...field}
                  id="login-password"
                  autoComplete="current-password"
                  showLabel={t.showPassword}
                  hideLabel={t.hidePassword}
                  className="h-11 [&_input]:text-base"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "login-password-error" : undefined}
                />
                {fieldState.invalid && <FieldError id="login-password-error" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" size="lg" className="w-full text-base" disabled={busy}>
            {busy && <Spinner data-icon="inline-start" />}
            {busy ? t.submitting : t.submit}
          </Button>
        </FieldGroup>
      </form>

      <Accordion type="single" collapsible className="mt-6 rounded-lg border px-4">
        <AccordionItem value="demo" className="border-0">
          <AccordionTrigger>{t.demo.title}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p className="text-muted-foreground">{t.demo.body}</p>
            <ul className="divide-y rounded-md border">
              {roles.map((r) => (
                <li key={r} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <span className="block font-medium text-heading">{roleText[r].label}</span>
                    <span className="block truncate text-muted-foreground">{sampleUsers[r].email}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={t.demo.useLabel.replace("{role}", roleText[r].label)}
                    onClick={() => {
                      form.setValue("email", sampleUsers[r].email, { shouldValidate: form.formState.isSubmitted });
                      form.setFocus("password");
                    }}
                  >
                    {t.demo.use}
                  </Button>
                </li>
              ))}
            </ul>
            <ResetDemo />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
