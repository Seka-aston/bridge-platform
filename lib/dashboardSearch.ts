import type { SearchItem } from "@/components/dashboard/DashboardShell";
import { dashboardText, roleText } from "@/content/dashboard";
import { notifications, opportunities } from "@/data/opportunities";
import { programmes } from "@/data/programmes";
import { postings } from "@/data/company";
import { assignments, courses, skills } from "@/data/student";
import { talentProfiles } from "@/data/talent";
import type { Role } from "@/data/users";

// What the dashboard search can find for each role (all sample data).
export function searchItemsFor(role: Role): SearchItem[] {
  const base = `/dashboard/${role}`;
  const pages = roleText[role].nav.map((n) => ({ label: n.label, meta: roleText[role].title, href: n.slug ? `${base}/${n.slug}` : base }));
  switch (role) {
    case "student":
      return [
        ...courses.map((c) => ({ label: c.title, meta: c.subtitle, href: `${base}/courses#${c.id}` })),
        ...assignments.map((a) => ({ label: a.title, meta: dashboardText.searchKinds.assignment, href: `${base}/assignments` })),
        ...opportunities.map((o) => ({ label: o.position, meta: o.company, href: `${base}/opportunities` })),
        ...skills.map((s) => ({ label: s.name, meta: dashboardText.searchKinds.skill, href: `${base}/skills-passport` })),
        ...pages,
      ];
    case "school":
      return [...talentProfiles.map((p) => ({ label: p.name, meta: p.discipline, href: `${base}/students` })), ...pages];
    case "company":
      return [
        ...talentProfiles.map((p) => ({ label: p.name, meta: `${p.discipline} · ${p.skills.join(", ")}`, href: `${base}/talent` })),
        ...postings.map((p) => ({ label: p.title, meta: p.skills.join(", "), href: `${base}/opportunities` })),
        ...pages,
      ];
    case "admin":
      return [...programmes.map((p) => ({ label: p.name, meta: dashboardText.searchKinds.programme, href: `${base}/programmes` })), ...pages];
  }
}

export function notificationsFor(role: Role) {
  return notifications[role];
}
