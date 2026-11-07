// Dashboard wording. ALL NEW, written for the prototype: Draft.
// The frame shows one "Prototype · sample data" label instead of a badge on every heading.
// Navigation follows Aston's student dashboard design (7 Nov 2026): a top pill menu plus an
// icon rail, applied to all four roles.

import type { Role } from "@/data/users";

export type IconKey =
  | "grid" | "book" | "clipboard" | "briefcase" | "award" | "message" | "sparkles"
  | "users" | "building" | "star" | "search" | "file" | "chart" | "settings" | "library";

export type NavLink = {
  label: string;
  slug: string; // "" = overview
  icon: IconKey;
  top?: boolean; // shown in the top pill menu
  rail?: 1 | 2; // icon rail group (omit = top menu only)
  checkpoint?: number; // screen built in this checkpoint; undefined = not in the plan yet
};

export const dashboardText = {
  prototypeLabel: "Prototype · sample data",
  prototypeShort: "Prototype",
  prototypeHint: "All dashboard wording is Draft.",
  skipLink: "Skip to main content",
  navLabel: "Dashboard",
  railLabel: "Dashboard shortcuts",
  openMenu: "Open dashboard menu",
  closeMenu: "Close dashboard menu",
  switchUser: "Switch user",
  signOut: "Back to website",
  settings: "Settings",
  accountMenu: "Account menu",
  sampleUser: "Sample user",
  overview: "Dashboard",
  comingTitle: "This screen comes next",
  comingBody: "It is built in Checkpoint {n}. The navigation already works so you can see the full structure.",
  notPlannedTitle: "Not in the prototype yet",
  notPlannedBody: "This screen is part of the full platform but isn't in the prototype plan. Tell us if it should be.",
  backToOverview: "Back to dashboard",
  close: "Close",
  viewDetails: "View details",
  search: "Search",
  searchTitle: "Search your dashboard",
  searchPlaceholder: "Type to search",
  searchEmpty: "No results. Try another word.",
  searchKinds: { assignment: "Assignment", skill: "Skill", programme: "Programme" },
  notifications: "Notifications",
  unread: "{n} unread",
  daysAgo: { 0: "Today", 1: "Yesterday", n: "{n} days ago" } as Record<string, string>,
  allOption: "All",
  showing: "Showing {n} of {total}",
  noResults: { title: "No matches", body: "Try a different search or filter." },
};

const settings: NavLink = { label: "Settings", slug: "settings", icon: "settings" };

export const roleText: Record<Role, { label: string; title: string; welcome: string; nav: NavLink[] }> = {
  student: {
    label: "Student",
    title: "Student dashboard",
    welcome: "Welcome Back, {name}.",
    nav: [
      { label: "Dashboard", slug: "", icon: "grid", top: true, rail: 1 },
      { label: "Courses", slug: "courses", icon: "book", rail: 1, checkpoint: 7 },
      { label: "Assignments", slug: "assignments", icon: "clipboard", top: true, rail: 1, checkpoint: 7 },
      { label: "Resources", slug: "resources", icon: "library", top: true, checkpoint: 7 },
      { label: "Opportunities", slug: "opportunities", icon: "briefcase", top: true, rail: 2, checkpoint: 7 },
      { label: "Skills Passport", slug: "skills-passport", icon: "award", rail: 2, checkpoint: 7 },
      { label: "Bridge AI (preview)", slug: "bridge-ai", icon: "sparkles", rail: 2, checkpoint: 7 },
      { label: "Messages", slug: "messages", icon: "message", rail: 2 },
      settings,
    ],
  },
  school: {
    label: "School",
    title: "School dashboard",
    welcome: "Welcome, {name}.",
    nav: [
      { label: "Dashboard", slug: "", icon: "grid", top: true, rail: 1 },
      { label: "Students", slug: "students", icon: "users", top: true, rail: 1, checkpoint: 9 },
      { label: "Programmes", slug: "programmes", icon: "book", top: true, rail: 1, checkpoint: 9 },
      { label: "Placements", slug: "placements", icon: "briefcase", top: true, rail: 2, checkpoint: 9 },
      { label: "Institution profile", slug: "profile", icon: "building", rail: 2, checkpoint: 9 },
      settings,
    ],
  },
  company: {
    label: "Company",
    title: "Company dashboard",
    welcome: "Welcome, {name}.",
    nav: [
      { label: "Dashboard", slug: "", icon: "grid", top: true, rail: 1 },
      { label: "Talent discovery", slug: "talent", icon: "search", top: true, rail: 1, checkpoint: 8 },
      { label: "Opportunities", slug: "opportunities", icon: "briefcase", top: true, rail: 1, checkpoint: 8 },
      { label: "Applicants", slug: "applicants", icon: "clipboard", top: true, rail: 2, checkpoint: 8 },
      { label: "Shortlist", slug: "shortlist", icon: "star", rail: 2, checkpoint: 8 },
      settings,
    ],
  },
  admin: {
    label: "Admin",
    title: "Admin dashboard",
    welcome: "Welcome, {name}.",
    nav: [
      { label: "Dashboard", slug: "", icon: "grid", top: true, rail: 1 },
      { label: "Users", slug: "users", icon: "users", top: true, rail: 1, checkpoint: 10 },
      { label: "Programmes", slug: "programmes", icon: "book", top: true, rail: 1, checkpoint: 10 },
      { label: "Content approvals", slug: "content", icon: "file", top: true, rail: 2, checkpoint: 10 },
      { label: "Reports", slug: "reports", icon: "chart", rail: 2, checkpoint: 10 },
      settings,
    ],
  },
};

export const signInText = {
  eyebrow: "Prototype",
  title: "Sign in as…",
  supporting: "This prototype has no accounts or passwords. Choose a sample user to see their dashboard.",
  continueAs: "Continue as {name}",
};

// ---------- Student dashboard (Aston's design) ----------
export const studentText = {
  goalLine: {
    remaining: "You are {n} lessons away from your weekly goal. Keep building.",
    one: "You are 1 lesson away from your weekly goal. Keep building.",
    done: "You've reached your weekly goal. Great work.",
  },
  addSkill: "Add New Skill",
  range: {
    label: "Period",
    options: { week: "Last 7 days", month: "Last 30 days", term: "Last 3 months" },
  },
  courses: {
    title: "My Current Courses",
    summary: "{active} active · {due} due this week",
    viewAll: "View all",
    module: "Module {n}",
    lessons: "{done} / {total} lessons",
    filter: { active: "Active", completed: "Completed", all: "All" },
    completed: "Completed",
  },
  passport: {
    title: "Skills Passport",
    subtitle: "Your verified record",
    open: "Open Skills Passport",
    cardLabel: "Bridge Passport",
    rank: "Rank #{n}",
    rankSample: "Sample rank",
    verifiedSoFar: "Skills verified so far",
    skillsUnit: "skills",
    id: "ID",
    stats: { enrolled: "Enrolled courses", completed: "Completed lessons", certificates: "Certificates" },
  },
  opportunities: {
    title: "Opportunities for you",
    subtitle: "Matched to your Skills Passport",
    open: "Open opportunities",
    columns: { company: "Company", position: "Position", skills: "Skills", match: "Match" },
    matchAll: "Matches your skills",
    matchSome: "Some skills to build",
    matchNone: "New skills to build",
    youHave: "You have this skill",
    apply: "Apply",
    applied: "Applied",
    sample: "Sample employers",
  },
  today: {
    title: "{name}, what are you doing today?",
    tabs: { build: "Build", learn: "Learn", connect: "Connect" },
    goalTitle: "Weekly learning goal",
    goalBody: "{done} of {target} lessons done. {left} more to reach your goal.",
    goalBodyDone: "{done} of {target} lessons done. Goal reached this week.",
    upNext: "Up next · {min} min",
    startLesson: "Start lesson: {title}",
    buildTitle: "Current project",
    buildMilestone: "Next milestone: {m}",
    buildAction: "Add evidence to your Skills Passport",
    connectTitle: "Coming up",
    connectAction: "See opportunities",
  },
  applyDialog: {
    title: "Apply to {position}",
    body: "Your Skills Passport will be shared with {company}. In this prototype nothing is sent; the application is saved in this browser tab.",
    confirm: "Send application",
    sending: "Sending…",
    cancel: "Cancel",
    done: "Application saved. Track it on the Opportunities page.",
  },
  assignments: {
    title: "Assignments",
    description: "Everything due across your courses.",
    filter: { all: "All", "to-do": "To do", submitted: "Submitted", graded: "Graded" },
    columns: { title: "Assignment", course: "Course", due: "Due", status: "Status" },
    status: { "to-do": "To do", submitted: "Submitted", graded: "Graded" },
    dueIn: { past: "{n} days ago", today: "Today", tomorrow: "Tomorrow", future: "In {n} days" },
    view: "View",
    brief: "Brief",
    grade: "Grade",
    submitTitle: "Submit your work",
    submitLabel: "Link to your work or a short note",
    submit: "Submit assignment",
    submitting: "Submitting…",
    submitted: "Submitted. Your facilitator will review it. (Prototype: saved in this browser tab only.)",
    required: "Add a link or a note before submitting.",
  },
  coursesPage: { title: "Courses", description: "Your enrolled courses and progress." },
  resourcesPage: { title: "Resources", description: "Articles and guides from Bridge." },
  opportunitiesPage: {
    title: "Opportunities",
    description: "Internships and jobs matched to your Skills Passport, and the applications you've made.",
    applicationsTitle: "Your applications",
    applicationsEmpty: { title: "No applications yet", body: "Apply to an opportunity or a programme and track it here.", action: "Browse programmes" },
    steps: ["Submitted", "In review", "Decision"],
    kind: { programme: "Programme", opportunity: "Opportunity" },
    appliedOn: "Applied {date}",
    currentStep: "Current step: {step}",
  },
  passportPage: {
    title: "Skills Passport",
    description: "Your skills, the evidence behind them and who verified them.",
    share: "Copy shareable link",
    copied: "Link copied",
    viewPublic: "View public version",
    skillsTitle: "Skills",
    verified: "Verified",
    pending: "Pending verification",
    verifiedBy: "Verified by {by}",
    evidence: "Evidence: {e}",
    projectsTitle: "Project evidence",
    certificatesTitle: "Certificates",
    issued: "{issuer} · {year}",
    addTitle: "Add a new skill",
    addName: "Skill name",
    addEvidence: "Evidence (optional): a project, link or short description",
    addSubmit: "Add skill",
    addCancel: "Cancel",
    addRequired: "Enter a skill name.",
    added: "Added. It shows as pending until your school or a partner verifies it. (Prototype: saved in this browser tab.)",
  },
  publicPassport: {
    eyebrow: "Bridge Skills Passport",
    note: "Public view: only skills, verified evidence and certificates are shown. Contact details are never public.",
    sample: "Sample profile",
  },
};

// Overview wording for the other roles (Checkpoint 6).
export const overviewText = {
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
