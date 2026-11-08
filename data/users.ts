// Four sample users (PROGRESS.md, prototype scope). On the log in screen their emails open
// their dashboards with any password. ILLUSTRATIVE ONLY: not real people or organisations.
// The student is the same sample learner used across the site (data/talent.ts).

export type Role = "student" | "school" | "company" | "admin";

export type SampleUser = {
  role: Role;
  name: string;
  detail: string;
  email: string; // .example addresses can never belong to a real person
  talentId?: string;
};

export const sampleUsers: Record<Role, SampleUser> = {
  student: { role: "student", name: "Diane M.", detail: "Software Development · TVET Level 5 graduate", email: "diane@sample.example", talentId: "sample-1" },
  school: { role: "school", name: "Jean-Paul K.", detail: "Programme coordinator · Sample TVET School", email: "jean-paul@sample-school.example" },
  company: { role: "company", name: "Grace N.", detail: "HR lead · Sample Tech Company", email: "grace@sample-tech.example" },
  admin: { role: "admin", name: "Eric H.", detail: "Platform administrator · Bridge", email: "eric@bridge.example" },
};

export const roles: Role[] = ["student", "school", "company", "admin"];

// Which sample user an email belongs to (case and spaces ignored), for the prototype log in.
export function roleForEmail(email: string): Role | undefined {
  const e = email.trim().toLowerCase();
  return roles.find((r) => sampleUsers[r].email === e);
}
