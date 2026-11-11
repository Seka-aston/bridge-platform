// Homepage copy, copied exactly from "Platform Redevelopment Notes: Bridge 1.0",
// section 4.2 (28 October 2026). Edit copy here, not inside components.
// Links point to placeholder routes until the real pages exist (Checkpoint 5).

export type NavItem = {
  label: string;
  href: string;
  // Dropdown links. Add them here when the contents from the slides arrive; the header
  // turns the item into a dropdown automatically.
  children?: { label: string; href: string }[];
};

export const header = {
  // Spec 4.2.2. Dropdown contents are "shared in slides" and not yet supplied.
  skipLink: "Skip to main content",
  homeLabel: "Bridge home",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  navLabel: "Main",
  nav: [
    { label: "For Talents", href: "/for-talents" },
    { label: "For Schools", href: "/for-schools" },
    { label: "For Companies", href: "/for-companies" },
    { label: "Ventures Lab", href: "/ventures-lab" },
    { label: "For Ecosystem", href: "/for-ecosystem" },
  ] as NavItem[],
  login: { label: "Login", href: "/sign-in" },
  primary: { label: "Book a Discovery Call", href: "/book-a-discovery-call" },
};

export const hero = {
  // Spec 4.2.3. The spec's full stop is dropped to match the other eyebrows (Aston, 7 Nov 2026).
  eyebrow: "THE FUTURE OF TVET EMPLOYABILITY",
  headline: "From Technical Skills to Real-World Opportunity.",
  supporting:
    "Bridge connects TVET students and graduates to practical learning, verified skills, industry experience, and career opportunities through one intelligent employability ecosystem.",
  primary: { label: "Join a Programme", href: "/programmes" },
  secondary: { label: "Hire Vetted Talent", href: "/for-companies" },
  additional: { label: "Book a Discovery Call", href: "/book-a-discovery-call" },
};

// Hero ecosystem visual (spec 4.2.3), from Aston's Figma hero (9 Nov 2026): a dotted map of
// Africa with sample learners linked to Bridge in Kigali. Illustrative only: the people are
// sample profiles, and no match scores are shown (content rule 4).
// TODO: awaiting Bridge approval. Learners across Africa show Bridge's ambition, not current reach.
export const heroVisual = {
  label:
    "Illustration: a map of Africa with sample learner profiles in six cities, each connected to Bridge in Kigali, Rwanda.",
  caption: "Illustration · sample profiles",
  hub: { title: "Bridge Hub", detail: "Kigali, Rwanda" },
  // Initials on the map, in the order of the connection lines.
  learners: ["AD", "CO", "YH", "MT", "JP", "TM"],
  cards: [
    { name: "Chiamaka O.", city: "Lagos", discipline: "Solar PV Technician", chip: "Sample profile" },
    { name: "Thabo M.", city: "Johannesburg", discipline: "Automotive Mechatronics", chip: "Verified" },
  ],
};

// Bridge AI preview bar under the hero buttons. Not a chat input (content rule 3): it links to the
// Bridge AI page and is marked "Coming soon".
export const heroAi = {
  prompt: "Ask Bridge anything: courses, internships, skills",
  href: "/bridge-ai",
  label: "Bridge AI preview: ask about courses, internships and skills. Coming soon.",
};

// Partner logos, between the trust figures and the ecosystem section. Heading and list supplied
// by Aston (11 Nov 2026). Logos are each organisation's own, from its website or Wikimedia
// Commons, in /public/partners. Partners without a usable logo are left out for now (the TVET
// schools, Yali Labs).
// - mark: shows `name` beside the logo, for logos that are a symbol only (as their own sites do).
// - invert: white logos, flipped to dark so they show on the light tile.
export type Partner = {
  name: string;
  label?: string;
  logo: { src: string; width: number; height: number };
  mark?: boolean;
  invert?: boolean;
};
const coatOfArms = { src: "/partners/rwanda-coat-of-arms.svg", width: 670, height: 732 };
export const partners = {
  heading: "Trusted by Partners, ESOs, Initiatives at National and Global level.",
  pause: "Pause logos",
  play: "Play logos",
  // Two rows that scroll in opposite directions: public bodies and initiatives, then companies.
  rows: [
    [
      { name: "UNDP", logo: { src: "/partners/undp.svg", width: 238, height: 482 } },
      { name: "timbuktoo", logo: { src: "/partners/timbuktoo.png", width: 370, height: 160 } },
      { name: "Ministry of ICT and Innovation", label: "MINICT", logo: coatOfArms, mark: true },
      { name: "Ministry of Education", label: "MINEDUC", logo: coatOfArms, mark: true },
      { name: "Rwanda TVET Board", logo: { src: "/partners/rtb.png", width: 285, height: 160 } },
      { name: "National Cyber Security Authority", logo: { src: "/partners/ncsa.png", width: 640, height: 139 } },
      { name: "Rwanda Energy Group", logo: { src: "/partners/reg.png", width: 233, height: 83 } },
      { name: "Broadband Systems Corporation", logo: { src: "/partners/bsc-rwanda.png", width: 276, height: 160 } },
      { name: "Irembo", logo: { src: "/partners/irembo.svg", width: 91, height: 25 }, invert: true },
    ],
    [
      { name: "Andela", logo: { src: "/partners/andela.png", width: 609, height: 160 } },
      { name: "Zipline", logo: { src: "/partners/zipline.svg", width: 77, height: 25 } },
      { name: "Spiro", logo: { src: "/partners/spiro.svg", width: 59, height: 24 } },
      { name: "iDebate Rwanda", logo: { src: "/partners/idebate-rwanda.svg", width: 421, height: 98 } },
      { name: "Mango 4G", logo: { src: "/partners/mango-4g.png", width: 640, height: 75 } },
      { name: "Awesomity Lab", logo: { src: "/partners/awesomity-lab.svg", width: 80, height: 80 }, mark: true, invert: true },
      { name: "Wood Habitat", logo: { src: "/partners/wood-habitat.svg", width: 1074, height: 1074 }, mark: true },
      { name: "Houz 54", logo: { src: "/partners/houz-54.png", width: 361, height: 160 }, invert: true },
    ],
  ] as Partner[][],
};

export const trust = {
  // Spec 4.2.4
  heading: "Built Around Real Learners. Connected to Industry.",
  supporting:
    "Bridge works with TVET learners, training institutions, facilitators, and industry partners to strengthen the journey from technical education to practical experience and economic opportunity.",
  // TODO: awaiting Bridge approval. Confirm each figure, its date and its precise definition before publishing.
  stats: [
    { value: "1,000+", label: "students in the Bridge community.", approved: false },
    { value: "24+", label: "TVET partner schools.", approved: false },
    { value: "15+", label: "industry firms engaged.", approved: false },
    { value: "45+", label: "facilitators.", approved: false },
  ],
};

export const ecosystem = {
  // Spec 4.2.5
  eyebrow: "ONE CONNECTED JOURNEY",
  headline: "More Than Learning. A Pathway to Opportunity.",
  supporting:
    "Technical education is the beginning. Bridge helps learners build practical experience, demonstrate what they can do, connect with industry, and prepare for their next opportunity.",
  cards: [
    {
      icon: "learn" as const,
      title: "Learn and Build",
      description:
        "Help learners strengthen their technical skills through structured training, practical projects, learning resources, and guided development.",
      capabilities: [
        "Structured courses and learning modules.",
        "Assignments and practical projects.",
        "Workplace readiness and soft skills.",
        "Progress tracking and feedback.",
      ],
      cta: { label: "Explore Learning", href: "/learning" },
    },
    {
      icon: "prove" as const,
      title: "Prove Your Skills",
      description:
        "Help students and graduates demonstrate their capabilities through the Bridge Skills Passport.",
      capabilities: [
        "Skills and project profiles.",
        "Evidence of practical work.",
        "Verification status.",
        "Achievements and certificates.",
        "A professional profile that can support opportunity applications.",
      ],
      cta: { label: "Explore Skills Passport", href: "/skills-passport" },
    },
    {
      icon: "connect" as const,
      title: "Connect to Opportunity",
      description:
        "Connect prepared learners with internships, employers, industry projects, mentorship, and entrepreneurship opportunities.",
      capabilities: [
        "Internship and job opportunities.",
        "Skills-based opportunity discovery.",
        "Application tracking.",
        "Industry engagement.",
        "Venture-building pathways.",
      ],
      cta: { label: "Explore Opportunities", href: "/opportunities" },
    },
  ],
};

export const pathways = {
  // Spec 4.2.6
  headline: "One Ecosystem. Different Pathways to Growth.",
  panels: [
    {
      icon: "talents" as const,
      audience: "For Talents",
      headline: "Build Skills. Gain Experience. Move Forward.",
      body: "Explore learning programmes, develop your Skills Passport, access practical experience, and discover opportunities aligned with your career goals.",
      cta: { label: "Explore Talent Opportunities", href: "/for-talents" },
    },
    {
      icon: "schools" as const,
      audience: "For Schools",
      headline: "Extend Learning Beyond the Classroom.",
      body: "Work with Bridge to connect students to practical training, industry exposure, career development, and structured employability support.",
      cta: { label: "Partner with Bridge", href: "/for-schools" },
    },
    {
      icon: "companies" as const,
      audience: "For Companies",
      headline: "Discover and Develop Technical Talent.",
      body: "Connect with emerging technical talent, publish opportunities, support internships, and engage learners through projects and practical industry experiences.",
      cta: { label: "Find Talent", href: "/for-companies" },
    },
    {
      icon: "partners" as const,
      audience: "For Ecosystem Partners",
      headline: "Help Build the Future of Technical Talent.",
      body: "Collaborate with Bridge on programmes, mentorship, venture development, industry partnerships, and pathways that connect technical education to economic opportunity.",
      cta: { label: "Explore Partnerships", href: "/for-ecosystem" },
    },
  ],
};

export const programmes = {
  // Spec 4.2.7. Cards come from the shared sample data in /data.
  heading: "Opportunities to Learn, Build, and Grow.",
  cta: { label: "Explore All Programmes", href: "/programmes" },
};

export const talent = {
  // Spec 4.2.8
  eyebrow: "SKILLS THAT CONNECT TO WORK",
  headline: "Help Employers See What Talent Can Do.",
  supporting:
    "Bridge brings together practical learning, skills evidence, and industry opportunities to help technical talent become more visible and better prepared for the world of work.",
  primary: { label: "Hire Vetted Talent", href: "/for-companies" },
  secondary: { label: "Explore the Skills Passport", href: "/skills-passport" },
};

export const bridgeAi = {
  // Spec 4.2.9. Must be presented as a product vision or development preview.
  eyebrow: "INTELLIGENCE FOR THE JOURNEY AHEAD",
  headline: "Your AI Companion from the Classroom to Your Career.",
  supporting:
    "Bridge AI is being developed to help TVET students and graduates navigate learning, understand skills gaps, prepare for opportunities, and explore their next steps with personalised guidance.",
  capabilities: [
    "Learning recommendations.",
    "Skills-gap guidance.",
    "CV and interview preparation.",
    "Career pathway exploration.",
    "Opportunity discovery.",
    "Entrepreneurship support.",
  ],
  cta: { label: "Explore Bridge AI", href: "/bridge-ai" },
};

export const impact = {
  // Spec 4.2.10. Approved stories only.
  headline: "Progress That Goes Beyond Graduation.",
  cta: { label: "Explore Bridge's Impact", href: "/impact" },
};

export const howItWorks = {
  // Spec 4.2.11. Must not imply every student progresses through every stage.
  headline: "One Connected Journey, from Learning to Opportunity.",
  steps: [
    { number: 1, title: "Learn", description: "Develop technical and professional skills." },
    { number: 2, title: "Build", description: "Apply learning through projects, practical training, and assessments." },
    { number: 3, title: "Demonstrate", description: "Record skills, achievements, and evidence in the Skills Passport." },
    { number: 4, title: "Connect", description: "Explore internships, employment, industry projects, and venture-building opportunities." },
  ],
  cta: { label: "Start Your Journey", href: "/sign-in" },
};

export const insights = {
  // Spec 4.2.12
  headline: "Ideas for the Future of Technical Talent.",
  cta: { label: "Explore Resources", href: "/resources" },
};

export const finalCta = {
  // Spec 4.2.13
  headline: "Let's Connect Technical Talent to Opportunity.",
  supporting:
    "Whether you are building your career, supporting students, hiring technical talent, or developing programmes with industry, Bridge can help you take the next step.",
  primary: { label: "Join a Programme", href: "/programmes" },
  secondary: { label: "Book a Discovery Call", href: "/book-a-discovery-call" },
  link: { label: "Partner with Bridge", href: "/for-ecosystem" },
};

export const footer = {
  // Spec 4.2.14. Mission statement: the live bridge.co.rw footer line (live copy).
  // Social links: official accounts only, never invented.
  missionStatement: "Empowering the next generation of skilled professionals in Rwanda through training, mentorship, and career opportunities." as string | undefined,
  audienceLinks: header.nav,
  otherLinks: [
    { label: "About Bridge", href: "/about" },
    { label: "Programmes", href: "/programmes" },
    { label: "Resources", href: "/resources" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie preferences", href: "/cookies" },
  ],
  // From the live bridge.co.rw footer. TODO: awaiting Bridge approval (confirm these are the
  // official details; the email is a Gmail address).
  contact: {
    address: "KN 67 Street, UR-CST Unipod, Kigali, Rwanda",
    phone: "+250 788 434 778",
    email: "bridgerwanda77@gmail.com",
    approved: false,
  } as undefined | { email?: string; phone?: string; address?: string; approved: boolean },
  // Official Instagram, supplied by Aston on 11 Nov 2026. `label` is read out by screen readers.
  social: [
    { label: "Bridge on Instagram (opens in a new tab)", href: "https://www.instagram.com/bridge.rw/", icon: "instagram" },
  ] as { label: string; href: string; icon: "instagram" }[],
};
