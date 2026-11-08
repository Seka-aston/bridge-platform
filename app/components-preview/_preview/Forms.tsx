"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarDays, Mail, Search } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Demo, Section } from "./Section";

// Sample form for the preview only. The real forms (apply, booking, partner, admin) move to this pattern in later steps.
const disciplines = ["Software Development", "Electrical Installation", "Wood Technology", "Welding", "Internet Technologies"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter an email address like name@example.com."),
  discipline: z.string().min(1, "Choose your discipline."),
  date: z.date({ error: "Choose a date for the call." }),
  contact: z.enum(["email", "phone"]),
  message: z.string().trim().max(300, "Keep your message under 300 characters.").optional(),
  consent: z.literal(true, { error: "Please agree so Bridge can contact you." }),
  updates: z.boolean(),
});
type Values = z.infer<typeof schema>;

// Rendered only when the calendar opens, so "today" is read in the browser.
function FutureCalendar({ value, onChange }: { value?: Date; onChange: (d?: Date) => void }) {
  return <Calendar mode="single" selected={value} onSelect={onChange} disabled={{ before: new Date() }} autoFocus />;
}

export function Forms() {
  const [openDate, setOpenDate] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", discipline: "", contact: "email", message: "", updates: false },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Request sent", { description: "Prototype: nothing was sent. In the real platform Bridge would reply by email." });
    form.reset();
  }

  return (
    <Section
      id="forms"
      eyebrow="Components"
      title="Forms"
      note="Press Submit with the form empty to see inline errors. Errors appear under each field and the first one gets focus. The button shows a spinner while sending, then a confirmation appears in the corner."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Book a discovery call</CardTitle>
            <CardDescription>Sample form showing every field type.</CardDescription>
          </CardHeader>
          <form id="preview-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="pv-name">Full name</FieldLabel>
                      <Input {...field} id="pv-name" autoComplete="name" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="pv-email">Email address</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <Mail />
                        </InputGroupAddon>
                        <InputGroupInput {...field} id="pv-email" type="email" autoComplete="email" aria-invalid={fieldState.invalid} />
                      </InputGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Controller
                    name="discipline"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="pv-discipline">Discipline</FieldLabel>
                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="pv-discipline" className="w-full" aria-invalid={fieldState.invalid} onBlur={field.onBlur} ref={field.ref}>
                            <SelectValue placeholder="Choose…" />
                          </SelectTrigger>
                          <SelectContent>
                            {disciplines.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="date"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="pv-date">Preferred date</FieldLabel>
                        <Popover open={openDate} onOpenChange={setOpenDate}>
                          <PopoverTrigger asChild>
                            <Button
                              id="pv-date"
                              ref={field.ref}
                              variant="outline"
                              aria-invalid={fieldState.invalid}
                              className="w-full justify-start border-input font-normal data-[empty=true]:text-muted-foreground"
                              data-empty={!field.value}
                            >
                              <CalendarDays data-icon="inline-start" />
                              {field.value ? format(field.value, "d MMMM yyyy") : "Choose a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <FutureCalendar
                              value={field.value}
                              onChange={(d) => {
                                field.onChange(d);
                                setOpenDate(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="contact"
                  control={form.control}
                  render={({ field }) => (
                    <FieldSet>
                      <FieldLegend variant="label">How should we contact you?</FieldLegend>
                      <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange} className="flex gap-6">
                        <Field orientation="horizontal">
                          <RadioGroupItem value="email" id="pv-c-email" />
                          <FieldLabel htmlFor="pv-c-email" className="font-normal">
                            Email
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <RadioGroupItem value="phone" id="pv-c-phone" />
                          <FieldLabel htmlFor="pv-c-phone" className="font-normal">
                            Phone
                          </FieldLabel>
                        </Field>
                      </RadioGroup>
                    </FieldSet>
                  )}
                />
                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="pv-message">
                        Message <span className="font-normal text-muted-foreground">(optional)</span>
                      </FieldLabel>
                      <Textarea {...field} id="pv-message" rows={4} aria-invalid={fieldState.invalid} />
                      <FieldDescription>What would you like to discuss?</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="consent"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <Checkbox id="pv-consent" name={field.name} checked={field.value === true} onCheckedChange={(v) => field.onChange(v === true)} aria-invalid={fieldState.invalid} ref={field.ref} />
                      <FieldContent>
                        <FieldLabel htmlFor="pv-consent" className="font-normal">
                          Bridge may contact me about this request.
                        </FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="updates"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="pv-updates">Programme updates</FieldLabel>
                        <FieldDescription>Occasional emails when new programmes open.</FieldDescription>
                      </FieldContent>
                      <Switch id="pv-updates" name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </form>
          <CardFooter className="justify-end gap-3 border-t">
            <Button variant="outline" type="button" onClick={() => form.reset()}>
              Clear
            </Button>
            <Button type="submit" form="preview-form" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              {form.formState.isSubmitting ? "Sending…" : "Submit"}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Demo label="Input with icon" className="space-y-2">
            <Label htmlFor="pv-search">Search talent</Label>
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput id="pv-search" placeholder="Skill, discipline or name" />
            </InputGroup>
          </Demo>
          <Demo label="States" className="space-y-6">
            <Field>
              <FieldLabel htmlFor="pv-default">Default</FieldLabel>
              <Input id="pv-default" defaultValue="Diane M." />
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="pv-invalid">With an error</FieldLabel>
              <Input id="pv-invalid" defaultValue="diane@" aria-invalid aria-describedby="pv-invalid-error" />
              <FieldError id="pv-invalid-error">Enter an email address like name@example.com.</FieldError>
            </Field>
            <Field data-disabled>
              <FieldLabel htmlFor="pv-disabled">Disabled</FieldLabel>
              <Input id="pv-disabled" defaultValue="BR-2026-0417" disabled />
              <FieldDescription>Your Skills Passport ID can&apos;t be changed.</FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="pv-checked" defaultChecked />
              <FieldLabel htmlFor="pv-checked" className="font-normal">
                Checked
              </FieldLabel>
            </Field>
            <Field orientation="horizontal" data-disabled>
              <Switch id="pv-switch-disabled" disabled />
              <FieldLabel htmlFor="pv-switch-disabled" className="font-normal">
                Disabled switch
              </FieldLabel>
            </Field>
          </Demo>
        </div>
      </div>
    </Section>
  );
}
