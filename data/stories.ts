// Learner and partner stories. APPROVED STORIES ONLY (spec 4.2.10, CLAUDE.md content rule 1).
// The four testimonials below were gathered and supplied by Aston (11 Nov 2026), copied exactly.
// The live site's old testimonials look like template content and are deliberately not used.

export type Story = {
  id: string;
  quote: string;
  name: string;
  role: string; // role and organisation, e.g. "TVET Graduate · SJITC Nyamirambo"
  initials?: string; // shown in a navy circle when there is no photo
  outcome?: string; // only verified outcomes, with a defined source
  image?: { src: string; alt: string };
  approved: boolean;
};

export const stories: Story[] = [
  {
    id: "mbabazi-kirenga-parrousia",
    quote:
      "Bridge helped me see that completing technical education is only one part of the journey. Developing practical skills, building confidence and understanding how to apply what I have learned are equally important steps towards creating opportunities for myself.",
    name: "MBABAZI KIRENGA Parrousia",
    role: "TVET Graduate · SJITC Nyamirambo",
    initials: "MK",
    approved: true,
  },
  {
    id: "kwizera-sugira-alphonse",
    quote:
      "What makes Bridge valuable is its focus on learning beyond theory. It creates opportunities for students to develop practical abilities, discover areas where they can improve and prepare themselves for what comes after school.",
    name: "Alphonse KWIZERA SUGIRA",
    role: "TVET Student · KIVU Hills Academy",
    initials: "AK",
    approved: true,
  },
  {
    id: "mutsinzi-philbert",
    quote:
      "The future of technical talent depends on how effectively we connect skills with real-world problems and opportunities. Bridge is addressing an important part of that challenge by helping young people move beyond learning technical skills towards applying them, innovating and creating value.",
    name: "Philbert MUTSINZI",
    role: "Founder · Yali Labs",
    initials: "PM",
    approved: true,
  },
  {
    id: "karekezi-emmanuel",
    quote:
      "Strengthening TVET education requires more than delivering classroom instruction. Learners need practical exposure, relevant skills and stronger connections with industry. Initiatives such as Bridge can help complement institutional training and bring education closer to the needs of the labour market.",
    name: "Prof. KAREKEZI Emmanuel",
    role: "School Principal · ITS Kigali",
    initials: "KE",
    approved: true,
  },
];
