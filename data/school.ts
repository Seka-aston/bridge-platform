// Sample data for the school dashboard (Checkpoint 9). ILLUSTRATIVE ONLY.
// Jean-Paul K. coordinates programmes at this sample school. Its learners are the same
// sample talent profiles companies see (data/talent.ts), so the story matches across roles.

export const school = {
  name: "Sample TVET School",
  location: "Kigali, Rwanda",
  type: "TVET school",
  disciplines: ["Software Development", "Internet Technologies", "Electrical Installation", "Wood Technology", "Welding"],
};

export const classes = [
  { id: "sd5", name: "Software Development", level: "Level 5", learnerIds: ["sample-1", "sample-5"] },
  { id: "it5", name: "Internet Technologies", level: "Level 5", learnerIds: ["sample-4"] },
  { id: "ei5", name: "Electrical Installation", level: "Level 5", learnerIds: ["sample-2"] },
  { id: "wt4", name: "Wood Technology", level: "Level 4", learnerIds: ["sample-3"] },
  { id: "we4", name: "Welding", level: "Level 4", learnerIds: ["sample-6"] },
];

export type VerificationRequest = { id: string; talentId: string; skill: string; evidence?: string; daysAgo: number };

// Skills learners have asked the school to verify. The student's own unverified skills
// (data/student.ts) and any skill added during the demo are added on top.
export const verificationRequests: VerificationRequest[] = [
  { id: "vr1", talentId: "sample-3", skill: "Cabinet making", evidence: "Workshop storage design", daysAgo: 1 },
  { id: "vr2", talentId: "sample-5", skill: "MongoDB", evidence: "Event booking app for a youth centre", daysAgo: 3 },
];

export type PlacementStatus = "applied" | "in-placement" | "completed";

export const placements = [
  { id: "pl1", talentId: "sample-1", company: "Sample Tech Company", role: "Junior web developer (internship)", status: "completed" as PlacementStatus, period: "Jan–Jun 2026" },
  { id: "pl2", talentId: "sample-2", company: "Sample Solar Ltd", role: "Installation assistant", status: "completed" as PlacementStatus, period: "Feb–Apr 2026" },
  { id: "pl3", talentId: "sample-4", company: "Sample Network Services", role: "Network support placement", status: "completed" as PlacementStatus, period: "Mar–Jun 2026" },
  { id: "pl4", talentId: "sample-6", company: "Sample Workshop", role: "Fabrication placement", status: "in-placement" as PlacementStatus, period: "Sep 2026–Feb 2027" },
  { id: "pl5", talentId: "sample-5", company: "Sample Tech Company", role: "Back-End Developer Intern", status: "applied" as PlacementStatus, period: "Applied" },
];
export type Placement = (typeof placements)[number];

// How many of the school's learners take part in each Bridge programme (sample figures).
export const programmeParticipation: Record<string, number> = {
  "ventures-lab-2026": 2,
  "internship-training-jan-2027": 4,
  "entrepreneurship-groundbreaking": 1,
  "internship-training-mar-2026": 3,
};

export type Facilitator = { id: string; name: string; subject: string; email: string };

export const facilitators: Facilitator[] = [
  { id: "f1", name: "Josiane U.", subject: "Software Development", email: "josiane@sample-school.example" },
  { id: "f2", name: "Emmanuel H.", subject: "Electrical Installation", email: "emmanuel@sample-school.example" },
  { id: "f3", name: "Beatrice N.", subject: "Workplace readiness", email: "beatrice@sample-school.example" },
];
