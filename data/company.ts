// Sample data for the company dashboard (Checkpoint 8). ILLUSTRATIVE ONLY.
// The company is the sample employer Grace N. works for. Its open internship "o1" is the same
// opportunity students see in their dashboard, so a student's application can arrive here.

export const company = { name: "Sample Tech Company", location: "Kigali" };

export type PostingStatus = "open" | "draft" | "closed";

export type Posting = {
  id: string;
  title: string;
  location: string;
  mode: string;
  skills: string[];
  description: string;
  status: PostingStatus;
  postedDaysAgo: number;
};

export const postings: Posting[] = [
  {
    id: "o1",
    title: "Back-End Developer Intern",
    location: "Kigali",
    mode: "Hybrid",
    skills: ["Node.js", "SQL"],
    description: "Six-month internship building APIs for an inventory product, with a dedicated mentor.",
    status: "open",
    postedDaysAgo: 6,
  },
  {
    id: "c2",
    title: "Network Support Intern",
    location: "Kigali",
    mode: "On-site",
    skills: ["Networking", "Linux"],
    description: "Support the IT team with office networks and user help-desk requests.",
    status: "open",
    postedDaysAgo: 12,
  },
  {
    id: "c3",
    title: "Junior Front-End Developer",
    location: "Kigali",
    mode: "Hybrid",
    skills: ["JavaScript", "React"],
    description: "Entry-level role building customer-facing screens.",
    status: "draft",
    postedDaysAgo: 0,
  },
  {
    id: "c4",
    title: "IT Support Assistant",
    location: "Kigali",
    mode: "On-site",
    skills: ["Networking", "Customer support"],
    description: "Six-month role supporting staff with laptops, accounts and printers.",
    status: "closed",
    postedDaysAgo: 40,
  },
];

export type Stage = "new" | "reviewing" | "interview" | "offer" | "not-progressing";
export const stages: Stage[] = ["new", "reviewing", "interview", "offer", "not-progressing"];

export type Applicant = { id: string; talentId: string; postingId: string; stage: Stage; appliedDaysAgo: number };

// Sample applicants. A student's own application in this browser tab is added on top
// (see ApplicantsView), which is the first connected journey across roles.
export const applicants: Applicant[] = [
  { id: "ap1", talentId: "sample-5", postingId: "o1", stage: "reviewing", appliedDaysAgo: 2 },
  { id: "ap2", talentId: "sample-4", postingId: "c2", stage: "interview", appliedDaysAgo: 5 },
  { id: "ap3", talentId: "sample-4", postingId: "c4", stage: "not-progressing", appliedDaysAgo: 35 },
];

export const interviews = [{ talentId: "sample-4", postingId: "c2", when: "Thursday, 10:00", where: "Online" }];
