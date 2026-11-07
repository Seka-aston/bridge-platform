"use client";

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

/*
  Accessible form fields: visible labels, required marking, error text linked to the
  field (aria-describedby) and announced with aria-invalid. Errors show an icon as well
  as text, never colour alone. There's no red in the brand palette, so errors use
  navy text with a bold label and icon.
*/

const inputBase =
  "mt-2 block w-full rounded-control border bg-white px-3 py-2.5 text-gray-800 shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

function borderFor(error?: string) {
  return error ? "border-navy-900 border-2" : "border-gray-500";
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block font-semibold text-navy-900">
      {children}
      {required && <span className="text-gray-700"> (required)</span>}
    </label>
  );
}

export function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 font-semibold text-navy-900">
      <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0" />
      {error}
    </p>
  );
}

type Common = { id: string; label: string; error?: string; required?: boolean };

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
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        min={min}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${borderFor(error)}`}
      />
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

export function TextArea({ id, label, error, required, value, onChange }: Common & { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={id}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${borderFor(error)}`}
      />
      <ErrorText id={`${id}-error`} error={error} />
    </div>
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
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${borderFor(error)}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

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
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="font-semibold text-navy-900">
        {label}
        {required && <span className="text-gray-700"> (required)</span>}
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((o, i) => (
          <label
            key={o}
            className={`flex cursor-pointer items-center gap-3 rounded-control border px-4 py-3 has-[:checked]:border-green-700 has-[:checked]:bg-green-50 ${
              error ? "border-navy-900" : "border-gray-200"
            }`}
          >
            <input
              id={i === 0 ? id : undefined}
              type="radio"
              name={id}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              className="size-4 accent-green-700"
            />
            <span className="text-gray-800">{o}</span>
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-error`} error={error} />
    </fieldset>
  );
}

export function CheckboxField({ id, label, error, checked, onChange }: Common & { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4 shrink-0 accent-green-700"
        />
        <span className="text-gray-800">{label}</span>
      </label>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
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
    <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-card border-2 border-navy-900 bg-white p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900">
      <p className="flex items-center gap-2 font-bold text-navy-900">
        <AlertCircle aria-hidden className="size-5" /> {title}
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        {keys.map((k) => (
          <li key={k}>
            <a href={`#${k}`} className="font-semibold text-green-700 underline underline-offset-4 hover:text-green-800">
              {labels[k] ?? k}: {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
