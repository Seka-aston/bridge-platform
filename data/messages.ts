// Sample message threads for the student dashboard (Checkpoint 13). ILLUSTRATIVE ONLY.
// Messages sent during the demo are added on top and kept in this browser tab.

export type Message = { from: "me" | "them"; text: string; daysAgo: number };
export type Thread = { id: string; name: string; role: string; messages: Message[] };

export const threads: Thread[] = [
  {
    id: "facilitator",
    name: "Josiane U.",
    role: "Facilitator, Software Development · Sample TVET School",
    messages: [
      { from: "them", text: "Hi Diane, the REST endpoint assignment is due in 3 days. Remember to include input validation and clear error messages.", daysAgo: 2 },
      { from: "me", text: "Thank you. I'm working on it now. Is it fine to use Express?", daysAgo: 1 },
      { from: "them", text: "Yes, Express is fine. Send me the link to your work when it's ready and I'll review it.", daysAgo: 1 },
    ],
  },
  {
    id: "company",
    name: "Grace N.",
    role: "HR lead · Sample Tech Company",
    messages: [
      {
        from: "them",
        text: "Hello Diane, we saw your Skills Passport and liked your inventory app project. Our Back-End Developer Intern role is open if you'd like to apply.",
        daysAgo: 3,
      },
    ],
  },
  {
    id: "bridge",
    name: "Bridge team",
    role: "Bridge",
    messages: [
      {
        from: "them",
        text: "Welcome to Bridge! Your Skills Passport is ready. Add evidence to your projects so your school can verify your skills.",
        daysAgo: 10,
      },
    ],
  },
];
