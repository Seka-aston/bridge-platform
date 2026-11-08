"use client";

import { format, parseISO } from "date-fns";
import { AlertCircle, CalendarDays } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup as UiRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/*
  Form fields on shadcn/ui (redesign Step 5). Same props as before, so every form on the site
  uses them unchanged: visible labels, "(required)" marking, error text linked to the field
  (aria-describedby) and announced with aria-invalid. Errors use the destructive red with an
  icon and text, never colour alone. Date fields open a calendar (shadcn Calendar + Popover)
  and still store the date as YYYY-MM-DD.
*/

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <FieldLabel htmlFor={htmlFor}>
      <span>
        {children}
        {required && <span className="font-normal text-muted-foreground"> (required)</span>}
      </span>
    </FieldLabel>
  );
}

export function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <FieldError id={id} className="flex items-start gap-1.5">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      {error}
    </FieldError>
  );
}

type Common = { id: string; label: string; error?: string; required?: boolean };

const describe = (id: string, error?: string) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : undefined,
});

// Calendar picker for date fields. `min` (YYYY-MM-DD) disables earlier days.
function DateInput({ id, value, onChange, min, error }: { id: string; value: string; onChange: (v: string) => void; min?: string; error?: string }) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          size="lg"
          {...describe(id, error)}
          className="w-full justify-start border-input text-base font-normal data-[empty=true]:text-muted-foreground"
          data-empty={!value}
        >
          <CalendarDays data-icon="inline-start" />
          {selected ? format(selected, "d MMMM yyyy") : "Choose a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? (min ? parseISO(min) : undefined)}
          disabled={min ? { before: parseISO(min) } : undefined}
          onSelect={(d) => {
            onChange(d ? format(d, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function TextField({
  id,
  label,
  error,
  required,
  type = "text",
  value,
  onChange,
  autoComplete,
  min,
}: Common & {
  type?: "text" | "email" | "tel" | "date";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  min?: string;
}) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {type === "date" ? (
        <DateInput id={id} value={value} onChange={onChange} min={min} error={error} />
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 text-base"
          {...describe(id, error)}
        />
      )}
      <ErrorText id={`${id}-error`} error={error} />
    </Field>
  );
}

export function TextArea({ id, label, error, required, value, onChange }: Common & { value: string; onChange: (v: string) => void }) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Textarea id={id} name={id} rows={5} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-32 text-base" {...describe(id, error)} />
      <ErrorText id={`${id}-error`} error={error} />
    </Field>
  );
}

export function SelectField({
  id,
  label,
  error,
  required,
  value,
  onChange,
  options,
  placeholder,
}: Common & { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Select name={id} value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-11! w-full text-base" {...describe(id, error)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorText id={`${id}-error`} error={error} />
    </Field>
  );
}

// Options shown as selectable cards; the chosen one is highlighted.
export function RadioGroup({
  id,
  label,
  error,
  required,
  value,
  onChange,
  options,
}: Common & { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <FieldSet data-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}>
      <FieldLegend variant="label">
        {label}
        {required && <span className="font-normal text-muted-foreground"> (required)</span>}
      </FieldLegend>
      <UiRadioGroup name={id} value={value} onValueChange={onChange} className="grid gap-3 sm:grid-cols-2">
        {options.map((o, i) => {
          const itemId = i === 0 ? id : `${id}-${i}`;
          return (
            <FieldLabel key={o} htmlFor={itemId}>
              <Field orientation="horizontal">
                {/* Named by its text explicitly: Radix radios are buttons, which a <label> alone doesn't name for every assistive tool. */}
                <RadioGroupItem value={o} id={itemId} aria-labelledby={`${itemId}-text`} aria-invalid={error ? true : undefined} />
                <span id={`${itemId}-text`} className="font-normal">
                  {o}
                </span>
              </Field>
            </FieldLabel>
          );
        })}
      </UiRadioGroup>
      <ErrorText id={`${id}-error`} error={error} />
    </FieldSet>
  );
}

export function CheckboxField({ id, label, error, checked, onChange }: Common & { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Field orientation="horizontal" data-invalid={error ? true : undefined}>
      <Checkbox id={id} name={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" {...describe(id, error)} />
      <FieldContent>
        <FieldLabel htmlFor={id} className="font-normal">
          {label}
        </FieldLabel>
        <ErrorText id={`${id}-error`} error={error} />
      </FieldContent>
    </Field>
  );
}

// Shown at the top of a form after a failed submit; links jump to each problem field.
export function ErrorSummary({
  title,
  errors,
  labels,
  summaryRef,
}: {
  title: string;
  errors: Record<string, string>;
  labels: Record<string, string>;
  summaryRef: React.RefObject<HTMLDivElement | null>;
}) {
  const keys = Object.keys(errors);
  if (keys.length === 0) return null;
  return (
    <Alert ref={summaryRef} tabIndex={-1} role="alert" variant="destructive" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {keys.map((k) => (
            <li key={k}>
              <a href={`#${k}`} className="font-medium underline underline-offset-4 hover:no-underline">
                {labels[k] ?? k}: {errors[k]}
              </a>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
