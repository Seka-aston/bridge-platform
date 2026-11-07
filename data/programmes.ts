// Shared sample programme data (used by the homepage now, dashboards later).
// Names, descriptions, eligibility and durations come from the live bridge.co.rw site.
// TODO: awaiting Bridge approval. All dates are SAMPLE dates chosen so the prototype shows
// every status; the live site gives no application dates. Replace with the approved source.
//
// Status is never stored: it is calculated from the dates (see lib/programmes.ts).

export type Programme = {
  id: string;
  name: string;
  summary: string;
  audience: string;
  eligibility: string[];
  format: string;
  location: string;
  opensOn: string; // applications open (YYYY-MM-DD)
  closesOn: string; // applications close
  endsOn: string; // programme ends; after this it is archived
  image?: { src: string; alt: string };
  featured?: boolean; // Bridge Ventures Lab, featured when relevant and available
  approved: boolean;
};

export const programmes: Programme[] = [
  {
    id: "ventures-lab-2026",
    name: "Bridge Ventures Lab 2026",
    summary:
      "A six-week, in-person venture-building experience for TVET graduates and young technical innovators ready to turn their skills into scalable ventures.",
    audience: "TVET graduates and young technical innovators",
    eligibility: [
      "TVET graduates or current advanced-level TVET students",
      "Ability to commit to the full six-week, in-person programme",
      "Access to a personal laptop for the duration of the programme",
    ],
    format: "In person · 6 weeks",
    location: "Kigali, Rwanda",
    opensOn: "2026-10-15",
    closesOn: "2026-11-30",
    endsOn: "2027-02-28",
    featured: true,
    approved: false,
  },
  {
    id: "internship-training-jan-2027",
    name: "Internship and Training Placement: January intake",
    summary: "Structured internships aligned with industry needs and the TVET curriculum.",
    audience: "Level 5 TVET students",
    eligibility: ["Enrolled in a TVET programme", "Minimum 60% academic score", "English proficiency"],
    format: "Workplace placement · 3–6 months",
    location: "Partner companies in Rwanda",
    opensOn: "2026-12-01",
    closesOn: "2027-01-10",
    endsOn: "2027-07-31",
    approved: false,
  },
  {
    id: "entrepreneurship-groundbreaking",
    name: "Entrepreneurship Groundbreaking",
    summary: "Training and support for aspiring entrepreneurs to turn ideas into businesses.",
    audience: "Aspiring entrepreneurs in the Bridge community",
    eligibility: ["A strong business idea", "Commitment to the programme duration"],
    format: "Training and mentorship · 12 weeks",
    location: "Kigali, Rwanda",
    opensOn: "2026-08-15",
    closesOn: "2026-10-15",
    endsOn: "2027-01-15",
    approved: false,
  },
  {
    id: "internship-training-mar-2026",
    name: "Internship and Training Placement: March intake",
    summary: "Structured internships aligned with industry needs and the TVET curriculum.",
    audience: "Level 4 TVET students",
    eligibility: ["Enrolled in a TVET programme", "Minimum 60% academic score", "English proficiency"],
    format: "Workplace placement · 3–6 months",
    location: "Partner companies in Rwanda",
    opensOn: "2026-02-01",
    closesOn: "2026-03-01",
    endsOn: "2026-09-30",
    approved: false,
  },
];
