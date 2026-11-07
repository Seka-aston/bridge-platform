// Sample internship and job opportunities (Checkpoint 7). ILLUSTRATIVE ONLY:
// the companies are fictional and labelled "Sample" (no real names or logos without
// Bridge's permission). No match percentages: the student's matching skills are named instead.

export type Opportunity = {
  id: string;
  company: string;
  location: string;
  mode: string;
  position: string;
  skills: string[];
  description: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    company: "Sample Tech Company",
    location: "Kigali",
    mode: "Hybrid",
    position: "Back-End Developer Intern",
    skills: ["Node.js", "SQL"],
    description: "Six-month internship building APIs for an inventory product, with a dedicated mentor.",
  },
  {
    id: "o2",
    company: "Sample Fintech Ltd",
    location: "Kigali",
    mode: "On-site",
    position: "Junior Back-End Engineer",
    skills: ["Python", "REST APIs"],
    description: "Entry-level role on the payments team, working on internal services.",
  },
  {
    id: "o3",
    company: "Sample Studio",
    location: "Remote",
    mode: "Remote",
    position: "Back-End Developer",
    skills: ["Java", "PostgreSQL"],
    description: "Contract role maintaining a booking platform's database and services.",
  },
];

// Short sample notifications per role for the bell menu.
export const notifications = {
  student: [
    { id: "n1", text: "New assignment: Build a REST endpoint for products", daysAgo: 0, unread: true },
    { id: "n2", text: "Your SQL skill was verified by Sample TVET School", daysAgo: 2, unread: true },
    { id: "n3", text: "Sample Tech Company posted an internship that matches your skills", daysAgo: 4, unread: false },
  ],
  school: [
    { id: "n1", text: "Claudine I. submitted project evidence for verification", daysAgo: 1, unread: true },
    { id: "n2", text: "Internship applications open on 1 December", daysAgo: 3, unread: false },
  ],
  company: [
    { id: "n1", text: "2 new verified profiles match your Back-End Developer Intern role", daysAgo: 0, unread: true },
    { id: "n2", text: "Your opportunity listing was approved", daysAgo: 5, unread: false },
  ],
  admin: [
    { id: "n1", text: "11 items are awaiting Bridge approval", daysAgo: 0, unread: true },
    { id: "n2", text: "Bridge Ventures Lab 2026 closes for applications soon", daysAgo: 1, unread: false },
  ],
};
