// Shared sample talent profiles. ILLUSTRATIVE ONLY: these are not real people.
// Every card shows a "Sample profile" label (CLAUDE.md content rule 4). No match percentages.
// Disciplines come from the live site's internship tracks.
// Availability is only shown when the learner has consented to share it.

export type TalentProfile = {
  id: string;
  name: string;
  discipline: string;
  level: string;
  skills: string[];
  projectEvidence: string[];
  verification: "verified" | "in-progress";
  experience: string;
  availability?: { consented: boolean; text: string };
  suitableFor: string[];
};

export const talentProfiles: TalentProfile[] = [
  {
    id: "sample-1",
    name: "Diane M.",
    discipline: "Software Development",
    level: "TVET Level 5 graduate",
    skills: ["Node.js", "REST APIs", "SQL", "Git"],
    projectEvidence: ["Inventory app for a local cooperative", "School attendance tracker"],
    verification: "verified",
    experience: "6-month internship as a junior web developer",
    availability: { consented: true, text: "Available from January 2027" },
    suitableFor: ["Junior developer roles", "Software internships"],
  },
  {
    id: "sample-2",
    name: "Eric N.",
    discipline: "Electrical Installation",
    level: "TVET Level 5 student",
    skills: ["Domestic wiring", "Solar PV installation", "Safety inspection"],
    projectEvidence: ["Solar lighting installation for a training workshop"],
    verification: "verified",
    experience: "3-month placement with an installation contractor",
    availability: { consented: false, text: "" },
    suitableFor: ["Electrical internships", "Solar installation projects"],
  },
  {
    id: "sample-3",
    name: "Claudine I.",
    discipline: "Wood Technology",
    level: "TVET Level 4 student",
    skills: ["Furniture design", "Joinery", "Technical drawing"],
    projectEvidence: ["Classroom furniture set", "Workshop storage design"],
    verification: "in-progress",
    experience: "Workshop projects during training",
    availability: { consented: true, text: "Open to internships" },
    suitableFor: ["Workshop internships", "Industry projects"],
  },
  {
    id: "sample-4",
    name: "Jean B.",
    discipline: "Internet Technologies",
    level: "TVET Level 5 graduate",
    skills: ["Networking", "Linux", "Router configuration", "Customer support"],
    projectEvidence: ["Network set-up for a school computer lab"],
    verification: "verified",
    experience: "4-month placement with an internet service provider",
    availability: { consented: true, text: "Available now" },
    suitableFor: ["Network support roles", "IT support internships"],
  },
  {
    id: "sample-5",
    name: "Alice K.",
    discipline: "Software Development",
    level: "TVET Level 5 student",
    skills: ["JavaScript", "Node.js", "MongoDB", "Git"],
    projectEvidence: ["Event booking app for a youth centre"],
    verification: "in-progress",
    experience: "Course projects and a hackathon team",
    availability: { consented: false, text: "" },
    suitableFor: ["Software internships"],
  },
  {
    id: "sample-6",
    name: "Patrick N.",
    discipline: "Welding",
    level: "TVET Level 4 graduate",
    skills: ["MIG welding", "Metal fabrication", "Workshop safety"],
    projectEvidence: ["Steel gate and frame for a community building"],
    verification: "verified",
    experience: "6-month placement in a fabrication workshop",
    availability: { consented: true, text: "Available from February 2027" },
    suitableFor: ["Fabrication roles", "Workshop apprenticeships"],
  },
];
