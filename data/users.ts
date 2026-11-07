// Four sample users for the "Sign in as…" screen (PROGRESS.md, prototype scope).
// ILLUSTRATIVE ONLY: not real people or organisations. No passwords; nothing is stored.
// The student is the same sample learner used across the site (data/talent.ts).

export type Role = "student" | "school" | "company" | "admin";

export type SampleUser = {
  role: Role;
  name: string;
  detail: string;
  talentId?: string;
};

export const sampleUsers: Record<Role, SampleUser> = {
  student: { role: "student", name: "Diane M.", detail: "Software Development · TVET Level 5 graduate", talentId: "sample-1" },
  school: { role: "school", name: "Jean-Paul K.", detail: "Programme coordinator · Sample TVET School" },
  company: { role: "company", name: "Grace N.", detail: "HR lead · Sample Tech Company" },
  admin: { role: "admin", name: "Eric H.", detail: "Platform administrator · Bridge" },
};

export const roles: Role[] = ["student", "school", "company", "admin"];
