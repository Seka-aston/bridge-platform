// Shared sample articles. Titles, summaries, categories and dates come from the live
// bridge.co.rw Resources section (whose links currently go nowhere).
// TODO: awaiting Bridge approval. Only approved articles may be published.
// Full article text: NEW, written for the prototype from the live titles and summaries (Draft,
// Aston 8 Nov 2026). Practical advice only: no statistics, quotes or claims about Bridge.
// Reading time is calculated from the text (lib/articles.ts).

export type ArticleBlock = { heading?: string; paragraphs?: string[]; list?: string[] };

export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  publishedOn: string; // YYYY-MM-DD
  readingMinutes?: number;
  image?: { src: string; alt: string };
  href: string;
  body?: ArticleBlock[];
  approved: boolean;
};

export const articles: Article[] = [
  {
    id: "successful-internship-tips",
    category: "Blog",
    title: "5 Tips for a Successful Internship",
    excerpt:
      "Learn how to make the most of your internship experience, from setting goals to networking effectively.",
    publishedOn: "2023-10-26",
    href: "/resources/successful-internship-tips",
    body: [
      {
        paragraphs: [
          "An internship is your first chance to use what you learned in training on real work, with real people depending on it. The way you approach those first weeks shapes what you learn, who remembers you and what you can show afterwards. These five habits will help you get the most from it.",
        ],
      },
      {
        heading: "1. Set two or three goals before you start",
        paragraphs: [
          "Before your first day, write down what you want to be able to do by the end. Keep the goals specific: \"configure a small office network on my own\" is more useful than \"learn networking\". Share them with your supervisor in your first week. It shows initiative, and it helps them give you the right tasks.",
          "Look at your goals every Friday. If you are not getting closer to one of them, ask for a task that would help.",
        ],
      },
      {
        heading: "2. Ask good questions, and write down the answers",
        paragraphs: [
          "Nobody expects an intern to know everything. They do expect you to ask clearly and not to ask the same thing twice. Before you ask, try for a few minutes on your own and note what you tried. Then ask, write the answer down, and keep your notes in one place you can search later.",
        ],
      },
      {
        heading: "3. Treat every task as evidence",
        paragraphs: [
          "Small tasks add up. After you finish something, take a minute to record what you did, what tools you used and what the result was. A photo of an installation, a screenshot of working code or a short description of a problem you solved can all become evidence in your Skills Passport.",
          "Ask your supervisor if you may keep these records, and never include information that belongs to the company or its customers.",
        ],
      },
      {
        heading: "4. Build relationships, not just a contact list",
        paragraphs: ["Networking at work is simply being someone people are glad to work with. That means:"],
        list: [
          "arriving on time and telling people early if you will be late;",
          "offering to help when you have finished your own work;",
          "learning the names and roles of the people around you;",
          "thanking people who teach you something, and telling them later how you used it.",
        ],
      },
      {
        heading: "5. Ask for feedback, then act on it",
        paragraphs: [
          "Halfway through, ask your supervisor two questions: \"What am I doing well?\" and \"What should I do differently?\" Listen without defending yourself, thank them, and choose one thing to improve straight away. At the end of the internship, ask whether they would be willing to confirm your skills or act as a reference.",
        ],
      },
      {
        heading: "Before you leave",
        paragraphs: [
          "In your last week, update your Skills Passport with the skills you used and the evidence you collected, and ask your school or supervisor to verify them. Write a short note thanking your team. A good ending is often what people remember most.",
        ],
      },
    ],
    approved: false,
  },
  {
    id: "mentee-guide",
    category: "Mentorship Guide",
    title: "Guide for Mentees: How to Build a Great Mentoring Relationship",
    excerpt:
      "This guide provides practical advice for students on how to engage with their mentors for maximum benefit.",
    publishedOn: "2023-10-10",
    href: "/resources/mentee-guide",
    body: [
      {
        paragraphs: [
          "A mentor is someone with more experience who gives some of their time to help you grow. A good mentoring relationship can help you make better career choices, avoid common mistakes and build confidence. Most of what makes it work depends on you, the mentee. This guide explains how to start well and keep it useful for both of you.",
        ],
      },
      {
        heading: "Before your first meeting",
        paragraphs: ["Spend some time thinking about what you want help with. Prepare short answers to these questions:"],
        list: [
          "What am I studying or working on now?",
          "Where would I like to be in one or two years?",
          "What is the one thing I am finding hardest at the moment?",
        ],
      },
      {
        heading: "Agree how you will work together",
        paragraphs: [
          "In your first meeting, agree on the practical details: how often you will meet, for how long, and how you will stay in touch between meetings. Ask your mentor how they prefer to be contacted and how quickly they usually reply. Write these agreements down so you both remember them.",
        ],
      },
      {
        heading: "Come prepared every time",
        paragraphs: [
          "Your mentor's time is valuable. Send a short message before each meeting with what you would like to discuss, and bring any work you want feedback on. During the meeting, take notes. Afterwards, send a brief thank-you with the one or two actions you have agreed to take.",
        ],
      },
      {
        heading: "Be honest about what is difficult",
        paragraphs: [
          "Mentors can only help with problems they know about. If you are struggling with a course, unsure about a career path or nervous about an interview, say so. A good mentor will not judge you for it. They have usually faced something similar themselves.",
        ],
      },
      {
        heading: "Follow through",
        paragraphs: [
          "The most important part of mentoring happens between meetings. If you agreed to update your CV, apply for an opportunity or practise a skill, do it, and tell your mentor how it went. Following through shows you take their help seriously, and it makes them more willing to keep investing in you.",
        ],
      },
      {
        heading: "Respect boundaries",
        paragraphs: [
          "Keep your relationship professional. Meet in appropriate places, respect your mentor's time, and do not share private information about them with others. If anything in the relationship makes you uncomfortable, speak to your programme coordinator.",
        ],
      },
      {
        heading: "When it comes to an end",
        paragraphs: [
          "Many mentoring relationships last for a set period. Near the end, look back together at what has changed since you started. Thank your mentor for their time, and ask if you may stay in touch. One day, you may be the mentor someone else needs.",
        ],
      },
    ],
    approved: false,
  },
];
// The live site's third resource, a webinar described as "upcoming" and dated November 2023,
// is left out: it would present an expired event as upcoming.
