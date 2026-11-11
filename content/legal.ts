// Privacy Policy, Terms of Use and Cookie preferences.
// NEW, Draft TEMPLATES written for the prototype (Aston, 8 Nov 2026). They are NOT legal advice
// and must be reviewed and replaced by Bridge's own legal wording before launch.
// Anything only Bridge can supply is left as a [bracketed gap]. Nothing is invented about Bridge.

export type LegalSection = { id: string; title: string; paragraphs: string[]; list?: string[] };

export const legalNotice = {
  review: "Template for Bridge's legal review. This is not legal advice and is not Bridge's official policy.",
  updated: "Last updated: [date to be confirmed by Bridge]",
  contents: "On this page",
};

export const privacy: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Privacy Policy",
  intro:
    "This policy explains what information Bridge collects when you use the Bridge platform, why we collect it, who can see it, and the choices you have.",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      paragraphs: [
        "Bridge is run by [Bridge's registered organisation name], [registered address], Rwanda. When this policy says \"Bridge\", \"we\" or \"us\", it means that organisation.",
        "If you have a question about your information, contact us at [privacy contact email to be confirmed by Bridge].",
      ],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      paragraphs: ["We collect only what we need to run the platform:"],
      list: [
        "Account details: your name, email address, phone number (optional) and the role you use Bridge in (student, school, company or partner).",
        "Learning and Skills Passport information: your discipline, level, courses, assignments, skills, project evidence, certificates and who verified them.",
        "Applications: the programmes and opportunities you apply to and the answers you give.",
        "Messages you send through the platform.",
        "Basic technical information needed to keep the service working and secure, such as the type of device and browser you use.",
      ],
    },
    {
      id: "why",
      title: "Why we use it",
      paragraphs: [
        "We use your information to provide the platform: to run courses and programmes, to keep your Skills Passport up to date, to process your applications, and to connect you with schools and companies you choose to work with.",
        "We do not sell your information. We do not use it for advertising.",
      ],
    },
    {
      id: "who-sees-it",
      title: "Who can see your information",
      paragraphs: [
        "Your school can see your learning progress and the skills it is asked to verify.",
        "Companies can see only the parts of your Skills Passport you have chosen to make public. Your availability is shown only if you have agreed to share it, and your contact details are never shown publicly.",
        "When you apply to an opportunity, the company receives your application and your public Skills Passport.",
        "We may use trusted service providers to host the platform and send emails. They may only use your information to provide that service to us.",
      ],
    },
    {
      id: "how-long",
      title: "How long we keep it",
      paragraphs: [
        "We keep your account and Skills Passport for as long as your account is open. If you close your account, we delete or anonymise your information within [period to be confirmed by Bridge], unless we must keep it longer by law.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      paragraphs: [
        "You can ask to see, correct or delete your information, ask us to stop using it, or withdraw consent you have given (for example, to share your availability). You can change most of these choices yourself in Settings.",
        "These rights come from Rwanda's data protection law [exact reference to be confirmed by Bridge's legal adviser]. If you are unhappy with how we handle your information, you can complain to us or to the national data protection authority.",
      ],
    },
    {
      id: "young-people",
      title: "Learners under 18",
      paragraphs: [
        "Some TVET learners are under 18. [Bridge to confirm how consent from a parent, guardian or school is obtained for younger learners.]",
      ],
    },
    {
      id: "security",
      title: "Keeping it safe",
      paragraphs: [
        "We protect your information with access controls and encryption, and we limit who at Bridge can see it. No online service can be completely secure, so we will tell you promptly if something goes wrong that affects you.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: ["If we make important changes, we will tell you on the platform before they take effect."],
    },
  ],
};

export const terms: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Terms of Use",
  intro: "These terms explain the rules for using the Bridge platform. By creating an account or using Bridge, you agree to them.",
  sections: [
    {
      id: "using-bridge",
      title: "Using Bridge",
      paragraphs: [
        "Bridge connects TVET students and graduates, schools, companies and ecosystem partners. You may use it for learning, building your Skills Passport, finding and offering opportunities, and running programmes.",
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      paragraphs: [
        "Keep your login details private and tell us straight away if you think someone else has used your account. You are responsible for what happens under your account.",
      ],
    },
    {
      id: "skills-passport",
      title: "Skills Passport and verification",
      paragraphs: [
        "Information in your Skills Passport must be true. A skill shows as verified only when a school or partner has checked the evidence. Verification confirms that evidence was seen; it is not a guarantee of future performance.",
      ],
    },
    {
      id: "opportunities",
      title: "Programmes and opportunities",
      paragraphs: [
        "Bridge helps learners and employers find each other, but it does not guarantee a place on a programme, a match, an internship, a job or any other outcome.",
        "Each programme and opportunity has its own eligibility rules and dates. Applications that arrive after the closing date may not be considered.",
      ],
    },
    {
      id: "bridge-ai",
      title: "Bridge AI",
      paragraphs: [
        "Bridge AI is in development. When it is available, its suggestions will be guidance only, and you should check important decisions with a facilitator or mentor.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: ["When using Bridge, you must not:"],
      list: [
        "post false information or someone else's work as your own;",
        "harass, discriminate against or mislead other users;",
        "try to access accounts or data that are not yours;",
        "use the platform for anything unlawful.",
      ],
    },
    {
      id: "content",
      title: "Your content",
      paragraphs: [
        "You keep ownership of the work and information you add. You allow Bridge to store and display it on the platform in the ways you choose, so the service can work.",
      ],
    },
    {
      id: "liability",
      title: "Our responsibility",
      paragraphs: [
        "We work to keep Bridge available and accurate, but we cannot promise it will always be error-free. [Limitation of liability wording to be provided by Bridge's legal adviser.]",
      ],
    },
    {
      id: "law",
      title: "Law and changes",
      paragraphs: [
        "These terms are governed by the laws of Rwanda [to be confirmed by Bridge]. We may update them; if the changes are important, we will tell you before they take effect.",
        "Questions about these terms: [contact email to be confirmed by Bridge].",
      ],
    },
  ],
};

export const cookies = {
  title: "Cookie preferences",
  intro:
    "Cookies and similar technologies are small files a website stores in your browser. This page explains what Bridge uses and lets you choose.",
  prototypeFact:
    "This prototype sets no cookies. It uses your browser's session storage only to remember demo actions in the current tab, and clears it when the tab closes.",
  categories: [
    {
      id: "essential",
      title: "Essential",
      description: "Needed for the platform to work, such as keeping you signed in and remembering your choices on this page. These are always on.",
      locked: true,
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Would help Bridge understand which pages are used so it can improve them. Not used in this prototype; an analytics set-up has not been agreed yet.",
      locked: false,
    },
  ],
  alwaysOn: "Always on",
  save: "Save preferences",
  saved: "Your preferences are saved in this browser.",
  sections: [
    {
      id: "changing",
      title: "Changing your mind",
      paragraphs: ["You can come back to this page at any time, or clear cookies and site data in your browser settings."],
    },
  ] as LegalSection[],
};
