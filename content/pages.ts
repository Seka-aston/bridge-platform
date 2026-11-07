// Copy for the public pages beyond the homepage (Checkpoint 5).
// Sources, marked on every block:
//   spec  = Platform Redevelopment Notes: Bridge 1.0, section 4.2 (copied exactly)
//   live  = the live bridge.co.rw site (US spellings changed to British, per CLAUDE.md rule 7)
//   NEW   = written for the prototype. Shown with a Draft badge (`draft: true`) so Aston can check it.
// Figures and fees from the live site also carry Draft: they need Bridge's approval (rule 2).

import { bridgeAi, ecosystem, finalCta, insights, pathways, programmes, talent, trust } from "@/content/home";

export type Block = { title: string; description: string };

// ---------- Audience pages ----------

export const forTalents = {
  header: { ...pathways.panels[0] }, // spec 4.2.6
  primary: { label: "Join a Programme", href: "/programmes" }, // spec CTA label
  secondary: { label: "Explore Skills Passport", href: "/skills-passport" }, // spec CTA label
  services: ecosystem, // spec 4.2.5
  programmesHeading: programmes.heading, // spec 4.2.7
  // live: "Why Choose Bridge?" support list
  support: {
    eyebrow: "Our Value",
    title: "Why Choose Bridge?",
    supporting: "We go beyond standard placements to provide a holistic support system for your career growth.",
    items: [
      { title: "Hands-on Experience", description: "Internships aligned with TVET curriculum to build practical skills." },
      { title: "Workshops & Training", description: "Develop professional and technical skills demanded by the industry." },
      { title: "Network Development", description: "Connect with mentors, industry professionals, and potential employers." },
      { title: "Ongoing Support", description: "Continuous guidance from university prep to your first job." },
    ] as Block[],
  },
};

export const forSchools = {
  header: { ...pathways.panels[1] }, // spec 4.2.6
  primary: { label: "Partner with Bridge", href: "/book-a-discovery-call" }, // spec CTA label
  // live: About page, "Why Our Work Matters"
  challenges: {
    title: "Why Our Work Matters",
    supporting:
      "We are responding to critical challenges faced by TVET students in their transition to the workforce.",
    items: [
      {
        title: "Limited Standardised Internships",
        description:
          "The lack of quality, standardised internship opportunities often leads to skill mismatches and low-quality placements, hindering a student's career start.",
      },
      {
        title: "Lack of Mentorship & Resources",
        description:
          "Many students lack access to professional mentorship and career guidance, resulting in poor career choices and misaligned goals after graduation.",
      },
    ] as Block[],
  },
  trust, // spec 4.2.4 (figures are Draft)
};

export const forCompanies = {
  header: { ...pathways.panels[2] }, // spec 4.2.6
  primary: { label: "Hire Vetted Talent", href: "/book-a-discovery-call" }, // spec CTA label
  talent, // spec 4.2.8
  // live: Partnerships page benefits
  benefits: {
    eyebrow: "Why Partner with Bridge?",
    title: "Benefits of Partnering with Us",
    supporting: "Join us in our mission to empower students and build a stronger workforce for tomorrow.",
    items: [
      {
        title: "Access Skilled Talent",
        description:
          "Connect with a pool of motivated and well-prepared TVET students ready for internships and entry-level roles.",
      },
      {
        title: "Shape Future Professionals",
        description:
          "Influence the development of the next generation of talent by providing practical experience and mentorship.",
      },
      {
        title: "Enhance Your Brand",
        description: "Demonstrate your commitment to community development and youth empowerment in Rwanda.",
      },
    ] as Block[],
  },
};

export const forEcosystem = {
  header: { ...pathways.panels[3] }, // spec 4.2.6
  primary: { label: "Explore Partnerships", href: "/book-a-discovery-call" }, // spec CTA label
  // live: Partnerships page
  intro: {
    eyebrow: "Collaborate With Us",
    title: "Partnerships",
    supporting:
      "We partner with leading institutions, employers, and industry professionals to create impactful opportunities for students.",
  },
  benefits: forCompanies.benefits,
  // live: mentor invitation
  mentor: {
    title: "Interested in being a mentor?",
    supporting:
      "Share your experience and guide the next generation of professionals. Partner with us to make a lasting impact.",
    cta: { label: "Book a Discovery Call", href: "/book-a-discovery-call" },
  },
};

// ---------- Ventures Lab (live page) ----------

export const venturesLab = {
  header: {
    eyebrow: "Bridge Ventures Lab 2026",
    title: "Turning Builders into Founders.",
    supporting:
      "A six-week, in-person venture-building experience for TVET graduates and young technical innovators ready to turn their skills into scalable ventures.",
  },
  figuresLine: "60 innovators. 6 weeks. One journey from technical talent to venture creation.", // live, Draft (figures)
  programmeId: "ventures-lab-2026",
  about: [
    {
      title: "What is Bridge Ventures Lab?",
      description:
        "Rwanda has a growing pool of technically skilled TVET graduates, but too few have a clear path from technical ability to venture creation. Bridge Ventures Lab exists to close that gap, giving young builders the frameworks, mentorship, and momentum to turn ideas into real businesses.",
    },
    {
      title: "Who is it for?",
      description:
        "TVET graduates and young technical innovators who have a problem they want to solve and the drive to build something meaningful. Whether you have an early-stage idea or a working prototype, this programme will help you move forward.",
    },
    {
      title: "What problem is it addressing?",
      description:
        "Many technically skilled young people struggle to translate their abilities into sustainable ventures. They lack access to structured venture-building support, mentorship, and the business knowledge needed to go from idea to market.",
    },
    {
      title: "What will participants gain?",
      description:
        "Participants will develop validated venture ideas, build prototypes, refine business models, receive mentorship from industry experts, and gain the skills and confidence to pitch and launch their ventures.",
    },
  ] as Block[],
  curriculum: {
    title: "Six Weeks That Transform Your Idea",
    supporting: "From problem discovery to market readiness: a structured path to venture creation.",
    weeks: [
      { title: "Discover", description: "Explore problems and opportunities worth solving." },
      { title: "Validate", description: "Test assumptions with real users and data." },
      { title: "Build", description: "Start building a prototype or MVP." },
      { title: "Develop", description: "Refine the product and business model." },
      { title: "Pitch", description: "Prepare and deliver a venture pitch." },
      { title: "Launch", description: "Take the venture toward market readiness." },
    ] as Block[],
  },
  gains: {
    title: "What You Will Gain",
    items: [
      { title: "Problem & Customer Validation", description: "Learn to identify real problems and validate them with potential customers." },
      { title: "Prototype/MVP Development", description: "Build a working prototype or minimum viable product." },
      { title: "Business Model Development", description: "Create a sustainable and scalable business model." },
      { title: "Market & Customer Understanding", description: "Deeply understand your target market and customer needs." },
      { title: "Mentorship", description: "Receive guidance from experienced entrepreneurs and industry experts." },
      { title: "Pitch Development", description: "Master the art of presenting your venture to investors and stakeholders." },
      { title: "Investment Readiness", description: "Prepare your venture for funding and investment opportunities." },
      { title: "Leadership Skills", description: "Develop entrepreneurial and leadership capabilities." },
    ] as Block[],
  },
  // live, Draft: contains figures and a fee that need Bridge's approval
  process: {
    title: "The Application Process",
    supporting: "Four clear phases from registration to commitment.",
    phases: [
      { title: "Register", description: "Open registration for interested TVET students and graduates." },
      {
        title: "Discover",
        description:
          "Applications are screened on background, genuineness of the idea, problem understanding, technical foundation, motivation, and commitment.",
      },
      { title: "Select", description: "Approximately 100 applicants are shortlisted, from which 60 innovators are selected." },
      {
        title: "Commit",
        description:
          "Selected participants confirm their place: commit to the full programme, confirm access to a personal laptop, and pay the 50,000 Frw programme commitment/operational fee.",
      },
    ] as Block[],
  },
  eligibilityNote: "Exact eligibility criteria are being finalised by Bridge. The following are preliminary guidelines:", // live
  cta: { title: "Ready to Join the 2026 Cohort?" }, // live
  applyCta: "View programme and apply", // NEW (Draft)
  discoveryCta: { label: "Book a Discovery Call", href: "/book-a-discovery-call" }, // spec CTA label
  eligibilityTitle: "Eligibility", // NEW (Draft)
  aboutTitle: "About the Programme", // live ("About the Program")
};

// ---------- Programmes ----------

export const programmesPage = {
  header: {
    title: programmes.heading, // spec 4.2.7
    // live: homepage programmes intro
    supporting:
      "We provide a mix of internship placement, mentorship, career guidance, and entrepreneurship training to prepare you for the modern workforce.",
  },
  // NEW (Draft): filter labels and messages
  filters: {
    label: "Show",
    options: { current: "Current", open: "Open", upcoming: "Upcoming", closed: "Closed", archived: "Archived" },
    count: "{n} programmes",
    countOne: "1 programme",
    empty: "No programmes match this filter right now.",
    draftNote: "Filter labels are new wording.",
  },
};

export const programmeDetail = {
  backLink: { label: "All programmes", href: "/programmes" },
  // NEW (Draft)
  notOpen: {
    upcoming: "Applications for this programme open on {date}. Come back then to apply.",
    closed: "Applications for this programme have closed.",
    archived: "This programme has finished.",
  },
  applyTitle: "Apply for this programme", // NEW (Draft)
  detailsLabel: "Programme details", // NEW (Draft), screen-reader label
  sessionNotFound: "This programme was created in a different browser tab, or the demo was reset.", // NEW (Draft)
};

// Application form. Labels marked live come from the live site's application flow.
export const applyForm = {
  prototypeNote: "Prototype: nothing is sent to Bridge. Your application is kept in this browser tab only.", // NEW (Draft)
  fields: {
    fullName: "Full name", // NEW
    email: "Email address", // NEW
    phone: "Phone number (optional)", // NEW
    school: "TVET school", // NEW
    discipline: "Technical discipline", // NEW
    level: "Current level", // NEW
    motivation: "What change do you hope to initiate in your community or industry after gaining skills and experience?", // live
    confirm: "By submitting, I confirm that all the information provided is accurate and I meet the eligibility requirements.", // live
    understand: "I understand that submitting an application does not guarantee selection.", // live
  },
  disciplines: ["Wood Technology", "Software Development", "Internet Technologies", "Electrical Installation", "Plumbing", "Welding", "Other"], // live tracks
  levels: ["TVET Level 4 student", "TVET Level 5 student", "TVET graduate"], // NEW, based on live intake levels
  submit: "Submit application", // NEW
  submitting: "Submitting…", // NEW
  success: {
    title: "Thank you for applying.", // live
    body: "We have received your information and will be in touch soon.", // live
    prototype: "In this prototype nothing was sent to Bridge. Your application is saved in this browser tab for the demo.", // NEW
  },
};

// ---------- Discovery call ----------

export const discoveryCall = {
  // NEW (Draft)
  header: {
    eyebrow: "Book a Discovery Call",
    title: "Let's Talk About Your Next Step.",
    supporting:
      "Tell us who you are and what you'd like to discuss, and the Bridge team will get back to you to arrange a call.",
  },
  prototypeNote: "Prototype: the booking tool isn't connected yet, so nothing is sent.", // NEW
  fields: {
    fullName: "Full name",
    email: "Email address",
    organisation: "Organisation (optional)",
    role: "I am…",
    roles: ["A talent (student or graduate)", "A school or training institution", "A company", "An ecosystem partner"],
    topic: "What would you like to discuss?",
    date: "Preferred date",
    time: "Preferred time",
    times: ["Morning (9:00–12:00)", "Afternoon (12:00–17:00)"],
  },
  submit: "Request a call",
  submitting: "Sending…",
  success: {
    title: "Thanks, your request is in.",
    body: "In this prototype nothing was sent. When the booking tool is connected, Bridge will confirm a time by email.",
  },
};

// ---------- Resources ----------

export const resourcesPage = {
  header: {
    title: insights.headline, // spec 4.2.12
    // live: Resources page intro
    supporting: "Explore articles, guides, and workshop information to support your career development journey.",
  },
  // NEW (Draft)
  articleBodyPlaceholder: "The full article text is awaiting Bridge. Only the summary is available in this prototype.",
  backLink: { label: "All resources", href: "/resources" },
};

// ---------- About (live) ----------

export const about = {
  header: {
    eyebrow: "About Bridge",
    title: "Empowering the Next Generation of Skilled Professionals",
    supporting:
      "Bridge connects TVET students in Rwanda with internships, training, and career opportunities to close the gap between learning and professional readiness.",
  },
  mission: {
    title: "Our Mission",
    description:
      "Bridge's mission is to empower student communities through accessible resources, fostering connections and collaboration to enhance career development.",
  },
  vision: {
    title: "Our Vision",
    description:
      "Bridge envisions a world where every graduate thrives through shared resources and connectedness, enabling full potential and inclusive collaboration.",
  },
  background: {
    title: "Background and Inspiration",
    description:
      "Bridge was founded to address the critical need for practical experience among TVET students in Rwanda. We saw a disconnect between the valuable skills learned in classrooms and the dynamic needs of the modern workplace.",
  },
  challenges: forSchools.challenges,
  trust,
};

// ---------- Topic pages (homepage CTA destinations; spec copy) ----------

const joinProgramme = { label: "Join a Programme", href: "/programmes" }; // spec CTA label
export const learningPage = { card: ecosystem.cards[0], programmesHeading: programmes.heading, action: joinProgramme };
export const skillsPassportPage = { eyebrow: "Skills Passport", card: ecosystem.cards[1], talent }; // eyebrow: spec product name
export const opportunitiesPage = { card: ecosystem.cards[2], programmesHeading: programmes.heading, action: joinProgramme };
export const bridgeAiPage = {
  ...bridgeAi, // spec 4.2.9
  capabilitiesLabel: "Bridge AI capabilities", // NEW, screen-reader heading
  // live: Bridge AI volunteer page
  volunteer: {
    title: "Help Us Train Bridge AI",
    supporting:
      "We are looking for students and young technical talents who are interested in volunteering in the training, testing, feedback, and development process of Bridge AI. Your contributions will directly shape how the platform serves the next generation of skilled professionals.",
    items: [
      { title: "Data Contribution", description: "Help curate and validate training data that makes Bridge AI smarter and more relevant." },
      { title: "Testing & Feedback", description: "Test features, report issues, and share feedback that shapes the user experience." },
      { title: "Content Review", description: "Review and improve AI-generated content to ensure accuracy and usefulness." },
    ] as Block[],
    cta: { label: "Book a Discovery Call", href: "/book-a-discovery-call" },
  },
};
export const impactPage = {
  trust,
  // NEW (Draft): how stories will be gathered. Stories themselves stay as placeholders until
  // Bridge supplies approved ones (content rule 1).
  storiesProcess: {
    title: "How Stories Are Shared",
    supporting: "Every story on this page is real, shared with permission, and checked before it is published.",
    steps: [
      { title: "Share", description: "A learner, school or partner tells their story to the Bridge team, in their own words." },
      { title: "Consent", description: "They agree in writing to what is published, including their name and photo, and can withdraw at any time." },
      { title: "Check", description: "Bridge confirms any outcome mentioned, such as an internship or a verified skill, against its records." },
      { title: "Publish", description: "The story is approved and published. Until then, this page shows a placeholder." },
    ] as Block[],
  },
  // NEW (Draft), based on spec 4.2.10: every quantitative outcome needs a source, period and method.
  reporting: {
    title: "How We Report Outcomes",
    supporting: "Every figure Bridge publishes about its impact comes with three things, so it can be checked.",
    items: [
      { title: "A source", description: "Where the number comes from, such as programme records or partner school data." },
      { title: "A period", description: "The dates it covers, for example one programme intake or one calendar year." },
      { title: "A method", description: "How it was counted, including what is included and what is not." },
    ] as Block[],
  },
};

export { finalCta };

// ---------- Form messages (NEW, Draft) ----------
export const formText = {
  errorSummaryTitle: "Please fix the following:",
  required: "This field is required.",
  email: "Enter an email address like name@example.com.",
  date: "Choose a date from tomorrow onwards.",
  tooShort: "Write at least 20 characters.",
  mustConfirm: "Tick this box to continue.",
  choose: "Choose one",
};
