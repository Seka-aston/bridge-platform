// Dashboard wording (Checkpoint 6). ALL NEW, written for the prototype: Draft.
// The shell shows one "Prototype · sample data" label instead of a badge on every heading.

import type { Role } from "@/data/users";

export type NavLink = { label: string; slug: string; checkpoint?: number };

export const dashboardText = {
  prototypeLabel: "Prototype · sample data",
  prototypeShort: "Prototype",
  prototypeHint: "All dashboard wording is Draft.",
  skipLink: "Skip to main content",
  navLabel: "Dashboard",
  openMenu: "Open dashboard menu",
  closeMenu: "Close dashboard menu",
  switchUser: "Switch user",
  signOut: "Back to website",
  sampleUser: "Sample user",
  overview: "Overview",
  comingTitle: "This screen comes next",
  comingBody: "It is built in Checkpoint {n}. The navigation already works so you can see the full structure.",
  backToOverview: "Back to overview",
  close: "Close",
  viewDetails: "View details",
  search: "Search",
  allOption: "All",
  showing: "Showing {n} of {total}",
  noResults: { title: "No matches", body: "Try a different search or filter." },
};

export const roleText: Record<Role, { label: string; title: string; welcome: string; nav: NavLink[] }> = {
  student: {
    label: "Student",
    title: "Student dashboard",
    welcome: "Welcome back, {name}",
    nav: [
      { label: "Courses and assignments", slug: "courses", checkpoint: 7 },
      { label: "Skills Passport", slug: "skills-passport", checkpoint: 7 },
      { label: "Opportunities", slug: "opportunities", checkpoint: 7 },
      { label: "Applications", slug: "applications", checkpoint: 7 },
      { label: "Bridge AI (preview)", slug: "bridge-ai", checkpoint: 7 },
    ],
  },
  school: {
    label: "School",
    title: "School dashboard",
    welcome: "Welcome, {name}",
    nav: [
      { label: "Students", slug: "students", checkpoint: 9 },
      { label: "Programmes", slug: "programmes", checkpoint: 9 },
      { label: "Placements", slug: "placements", checkpoint: 9 },
      { label: "Institution profile", slug: "profile", checkpoint: 9 },
    ],
  },
  company: {
    label: "Company",
    title: "Company dashboard",
    welcome: "Welcome, {name}",
    nav: [
      { label: "Talent discovery", slug: "talent", checkpoint: 8 },
      { label: "Opportunities", slug: "opportunities", checkpoint: 8 },
      { label: "Applicants", slug: "applicants", checkpoint: 8 },
      { label: "Shortlist", slug: "shortlist", checkpoint: 8 },
    ],
  },
  admin: {
    label: "Admin",
    title: "Admin dashboard",
    welcome: "Welcome, {name}",
    nav: [
      { label: "Users", slug: "users", checkpoint: 10 },
      { label: "Programmes", slug: "programmes", checkpoint: 10 },
      { label: "Content approvals", slug: "content", checkpoint: 10 },
      { label: "Reports", slug: "reports", checkpoint: 10 },
    ],
  },
};

export const signInText = {
  eyebrow: "Prototype",
  title: "Sign in as…",
  supporting: "This prototype has no accounts or passwords. Choose a sample user to see their dashboard.",
  continueAs: "Continue as {name}",
};

// Overview wording per role.
export const overviewText = {
  student: {
    stats: { skills: "Skills listed", evidence: "Projects evidenced", openProgrammes: "Programmes open now", applications: "Applications this session" },
    coursesTitle: "Your courses",
    applicationsTitle: "Your applications",
    applicationsEmpty: {
      title: "No applications yet",
      body: "Applications you submit on the website during this session appear here.",
      action: "Browse programmes",
    },
    appliedOn: "Submitted {date}",
  },
  school: {
    stats: { learners: "Learners", verified: "Skills verified", avgProgress: "Average progress" },
    tableTitle: "Learner progress",
    columns: { learner: "Learner", discipline: "Discipline", level: "Level", verification: "Verification", progress: "Progress" },
  },
  company: {
    stats: { profiles: "Talent profiles", verified: "Verified skills", shortlisted: "Shortlisted" },
    tableTitle: "Talent",
    filterLabel: "Discipline",
    searchPlaceholder: "Search by name or skill",
    columns: { name: "Name", discipline: "Discipline", verification: "Verification", availability: "Availability" },
    notShared: "Not shared",
    shortlistEmpty: { title: "Your shortlist is empty", body: "Shortlisting comes in Checkpoint 8." },
  },
  admin: {
    stats: { open: "Open programmes", upcoming: "Upcoming", users: "Sample users", pending: "Items awaiting approval" },
    tableTitle: "Programmes",
    columns: { name: "Programme", status: "Status", opens: "Applications open", closes: "Applications close" },
    approvalsTitle: "Awaiting Bridge approval",
    approvals: {
      stats: "Trust statistics",
      programmes: "Programme dates",
      articles: "Articles",
      contact: "Footer contact details",
      stories: "Learner stories (none supplied)",
    },
  },
};
