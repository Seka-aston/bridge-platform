// Sample data for the student dashboard (Checkpoint 7), shaped on Aston's design.
// ILLUSTRATIVE ONLY. The student is the shared sample learner Diane M. (data/talent.ts).
// Dates are stored as "days from today" so the demo always looks current.

export type CourseTone = "navy" | "deep" | "amber" | "green";
export type CourseIcon = "code" | "database" | "message" | "shield" | "monitor";

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  module: number;
  lessonsDone: number;
  lessonsTotal: number;
  tone: CourseTone;
  icon: CourseIcon;
};

export const courses: Course[] = [
  { id: "backend", title: "Back-End Development", subtitle: "Node.js & REST APIs", module: 3, lessonsDone: 8, lessonsTotal: 12, tone: "navy", icon: "code" },
  { id: "database", title: "Database Design", subtitle: "SQL fundamentals", module: 2, lessonsDone: 4, lessonsTotal: 10, tone: "deep", icon: "database" },
  { id: "communication", title: "Professional Communication", subtitle: "Workplace English", module: 4, lessonsDone: 8, lessonsTotal: 10, tone: "amber", icon: "message" },
  { id: "workplace", title: "Workplace Readiness", subtitle: "Internship prep", module: 1, lessonsDone: 3, lessonsTotal: 12, tone: "green", icon: "shield" },
  { id: "digital", title: "Digital Literacy", subtitle: "Tools for the workplace", module: 5, lessonsDone: 10, lessonsTotal: 10, tone: "navy", icon: "monitor" },
];

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  brief: string;
  dueInDays: number; // negative = past
  status: "to-do" | "submitted" | "graded";
  grade?: string;
};

export const assignments: Assignment[] = [
  { id: "a1", courseId: "backend", title: "Build a REST endpoint for products", brief: "Create GET and POST endpoints for a product list, with input validation and error responses.", dueInDays: 3, status: "to-do" },
  { id: "a2", courseId: "database", title: "Design a schema for a cooperative shop", brief: "Draw an entity-relationship diagram and write the CREATE TABLE statements.", dueInDays: 9, status: "to-do" },
  { id: "a3", courseId: "communication", title: "Write a professional email to a supervisor", brief: "Request feedback on your internship project in a clear, polite email.", dueInDays: -2, status: "submitted" },
  { id: "a4", courseId: "workplace", title: "Prepare your internship goals", brief: "List three learning goals for your internship and how you will measure them.", dueInDays: 14, status: "to-do" },
  { id: "a5", courseId: "digital", title: "Spreadsheet budget exercise", brief: "Build a monthly budget with formulas and a chart.", dueInDays: -20, status: "graded", grade: "Merit" },
];

// Lessons completed, as days ago (for the date-range selector and the weekly goal).
export const lessonLog: number[] = [0, 1, 1, 2, 3, 4, 5, 9, 10, 12, 15, 18, 20, 23, 26, 29, 33, 37, 41, 45, 52, 60, 67, 75, 82, 90, 98, 105, 113, 120, 128, 135, 140];
export const weeklyGoal = 10; // lessons per week

export const upNext = { courseId: "backend", title: "Building a REST endpoint", minutes: 12 };

export type Skill = { name: string; verified: boolean; verifiedBy?: string; evidence?: string };

export const skills: Skill[] = [
  { name: "Node.js", verified: true, verifiedBy: "Sample TVET School", evidence: "Inventory app for a local cooperative" },
  { name: "REST APIs", verified: true, verifiedBy: "Sample TVET School", evidence: "Inventory app for a local cooperative" },
  { name: "SQL", verified: true, verifiedBy: "Sample TVET School", evidence: "School attendance tracker" },
  { name: "Git", verified: true, verifiedBy: "Sample TVET School" },
  { name: "JavaScript", verified: true, verifiedBy: "Sample TVET School" },
  { name: "Express", verified: true, verifiedBy: "Sample TVET School", evidence: "Inventory app for a local cooperative" },
  { name: "PostgreSQL", verified: true, verifiedBy: "Sample TVET School", evidence: "School attendance tracker" },
  { name: "API testing", verified: true, verifiedBy: "Sample TVET School" },
  { name: "Data modelling", verified: true, verifiedBy: "Sample TVET School" },
  { name: "Technical writing", verified: true, verifiedBy: "Sample Tech Company" },
  { name: "Teamwork", verified: true, verifiedBy: "Sample Tech Company" },
  { name: "Time management", verified: true, verifiedBy: "Sample Tech Company" },
  { name: "Professional email", verified: true, verifiedBy: "Sample TVET School" },
  { name: "Problem solving", verified: true, verifiedBy: "Sample TVET School" },
  { name: "TypeScript", verified: false },
  { name: "Docker", verified: false },
];

export const projects = [
  { id: "p1", title: "Inventory app for a local cooperative", description: "A Node.js and PostgreSQL app that tracks stock and sales for a farming cooperative.", skills: ["Node.js", "Express", "PostgreSQL", "REST APIs"] },
  { id: "p2", title: "School attendance tracker", description: "A small web app teachers use to record attendance and export weekly reports.", skills: ["SQL", "JavaScript", "Data modelling"] },
];

export const certificates = [
  { id: "cert1", title: "Digital Literacy", issuer: "Sample TVET School", year: 2026 },
  { id: "cert2", title: "SQL Fundamentals", issuer: "Bridge (sample)", year: 2026 },
  { id: "cert3", title: "Workplace Readiness Level 1", issuer: "Bridge (sample)", year: 2025 },
];

export const passport = { id: "BR-2026-0417", rank: 12 };

// Build / Connect tab content (Learn is in Aston's design). Illustrative.
export const currentProject = { title: "Inventory app for a local cooperative", milestone: "Add sales reports", progress: 60 };
export const nextConnection = { title: "Mentor session with a back-end engineer", when: "Thursday, 14:00", where: "Online" };

// Lesson titles per course (Checkpoint 13: course and lesson pages). Illustrative.
// The first `lessonsDone` lessons of each course count as completed in the sample data.
export const lessons: Record<string, string[]> = {
  backend: [
    "Introduction to back-end development", "Setting up Node.js", "Working with npm packages", "Your first server with Express",
    "Routing and request handling", "Reading request data", "Validating input", "Handling errors",
    "Building a REST endpoint", "Connecting to a database", "Authentication basics", "Deploying your API",
  ],
  database: [
    "What is a database?", "Tables, rows and columns", "Keys and relationships", "Writing SELECT queries", "Filtering and sorting",
    "Joining tables", "Inserting, updating and deleting", "Designing a schema", "Normalisation basics", "Indexes and performance",
  ],
  communication: [
    "Communicating at work", "Writing clear emails", "Professional phone calls", "Taking part in meetings", "Giving and receiving feedback",
    "Presenting your work", "Workplace vocabulary", "Writing a short report", "Communicating with customers", "Review and practice",
  ],
  workplace: [
    "Preparing for your internship", "Workplace expectations", "Managing your time", "Working in a team", "Solving problems at work",
    "Health and safety", "Using workplace tools", "Taking initiative", "Handling feedback", "Building your network",
    "Recording your achievements", "Reflecting on your internship",
  ],
  digital: [
    "Using a computer confidently", "Files and folders", "Email and calendars", "Word processing", "Spreadsheet basics",
    "Spreadsheet formulas", "Staying safe online", "Working with cloud tools", "Presentations", "Final project",
  ],
};

// Sample lesson length in minutes (12 for the "Up next" lesson, as in Aston's design).
export const lessonMinutes = (courseId: string, index: number) => (courseId === "backend" && index === 8 ? 12 : 10 + ((index * 7 + courseId.length) % 11));
