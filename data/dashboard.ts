// Sample dashboard data (illustrative). Shared by the role dashboards so the story stays
// consistent: the school's learners are the same sample talent profiles companies see.

// Course progress for the sample student (Diane M.). Course names are illustrative.
export const studentCourses = [
  { id: "c1", title: "Workplace readiness and soft skills", progress: 80 },
  { id: "c2", title: "Web application project", progress: 55 },
  { id: "c3", title: "Career planning", progress: 20 },
];

// Programme progress per sample learner, as the school sees it (percent complete).
export const learnerProgress: Record<string, number> = {
  "sample-1": 90,
  "sample-2": 65,
  "sample-3": 40,
};
