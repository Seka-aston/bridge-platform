import type { Metadata } from "next";
import { Briefcase, GraduationCap, School, ShieldCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { roleText, signInText as t } from "@/content/dashboard";
import { roles, sampleUsers, type Role } from "@/data/users";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const icons: Record<Role, LucideIcon> = { student: GraduationCap, school: School, company: Briefcase, admin: ShieldCheck };

// "Sign in as…" (Checkpoint 6): choose one of four sample users. No passwords; nothing is stored.
export default function SignInPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader eyebrow={t.eyebrow} title={t.title} supporting={t.supporting} draft />
      <div className="mx-auto max-w-content px-gutter py-section-mobile md:py-section">
        <ul className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => {
            const u = sampleUsers[role];
            const Icon = icons[role];
            return (
              <li key={role} className="flex flex-col rounded-card border border-gray-200 bg-white p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-control bg-green-50">
                    <Icon aria-hidden className="size-6 text-green-700" />
                  </span>
                  <h2 className="text-h3 text-navy-900">{roleText[role].label}</h2>
                </div>
                <p className="mt-4 font-semibold text-navy-900">{u.name}</p>
                <p className="text-gray-700">{u.detail}</p>
                <div className="mt-auto pt-6">
                  <Button href={`/dashboard/${role}`}>{t.continueAs.replace("{name}", u.name)}</Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
