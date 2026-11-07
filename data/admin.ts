// Sample data for the admin dashboard (Checkpoint 10). ILLUSTRATIVE ONLY.
// Report figures are invented for the prototype and are always labelled "Sample figures".

export type UserRow = { id: string; name: string; role: "Student" | "School" | "Company" | "Admin"; organisation: string; status: "Active" | "Invited"; joinedDaysAgo: number };

export const extraUsers: UserRow[] = [
  { id: "u-fintech", name: "Sample Fintech Ltd (contact)", role: "Company", organisation: "Sample Fintech Ltd", status: "Invited", joinedDaysAgo: 2 },
  { id: "u-school2", name: "Second Sample School (contact)", role: "School", organisation: "Second Sample School", status: "Invited", joinedDaysAgo: 6 },
];

export const reports = {
  weeklySignups: [
    { label: "W1", value: 12 },
    { label: "W2", value: 18 },
    { label: "W3", value: 15 },
    { label: "W4", value: 22 },
    { label: "W5", value: 27 },
    { label: "W6", value: 24 },
    { label: "W7", value: 31 },
    { label: "W8", value: 29 },
  ],
  applicationsByProgramme: [
    { label: "Internship: March intake", value: 54 },
    { label: "Bridge Ventures Lab 2026", value: 48 },
    { label: "Internship: January intake", value: 31 },
    { label: "Entrepreneurship Groundbreaking", value: 22 },
  ],
  learnersByDiscipline: [
    { label: "Software Development", value: 38 },
    { label: "Electrical Installation", value: 27 },
    { label: "Internet Technologies", value: 19 },
    { label: "Wood Technology", value: 14 },
    { label: "Welding", value: 12 },
    { label: "Plumbing", value: 9 },
  ],
  tiles: { learners: 119, skillsVerified: 412, placements: 37, partners: 9 },
};
