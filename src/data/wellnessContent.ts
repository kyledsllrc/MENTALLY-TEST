import { Article, EmergencyContact } from "../types";

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    name: "National Center for Mental Health (NCMH) Crisis Hotline",
    organization: "Department of Health (DOH)",
    contactNumber: "1553",
    description: "24/7 dedicated crisis intervention, suicide prevention, and psychiatric emergency counseling across the Philippines.",
    availability: "24 Hours / 7 Days a week",
    isTollFree: true,
  },
  {
    name: "NCMH Mobile Crisis Lines",
    organization: "DOH / NCMH",
    contactNumber: "0917-899-8727 / 0966-351-4518",
    description: "Mobile contact for counseling and text/call distress support for Filipino youth and students.",
    availability: "24/7 Mobile Accessible",
  },
  {
    name: "Hopeline Philippines",
    organization: "Hopeline Project",
    contactNumber: "(02) 8804-4673 / 0917-558-4673",
    description: "Free and confidential phone support for emotional crisis, depression, and suicide prevention.",
    availability: "24/7 Service",
  },
  {
    name: "In Touch Community Services",
    organization: "In Touch Crisis Line",
    contactNumber: "(02) 8893-7603 / 0917-800-1123",
    description: "Crisis counseling, compassionate active listening, and referral assistance for young adults and students.",
    availability: "Daily 9:00 AM - 12:00 AM",
  },
  {
    name: "GAYON (Guidance Assistance to the Youth Online)",
    organization: "CHED Regional Support Initiative",
    contactNumber: "ched.gov.ph / Student Affairs",
    description: "Institutional guidance network connecting tertiary students directly with licensed counselors and student guidance advocates.",
    availability: "Academic Hours / Campus schedules",
  },
];

export const WELLNESS_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Navigating College Stress & Academic Burnout",
    category: "Stress Management",
    readTime: "3 min read",
    summary: "Proven strategies for college students facing exam crunches, thesis deadlines, and overloaded schedules.",
    content: [
      "Tertiary education brings intense academic workloads, exams, deadlines, and the pressure to excel. Recognizing early warning signs of burnout—such as chronic exhaustion, cynicism towards coursework, and brain fog—is the first step toward recovery.",
      "The 'Pomodoro Rhythm' (25 minutes of laser focus followed by a 5-minute cognitive disconnect) prevents the brain from entering chronic sympathetic overdrive.",
      "Remember: Rest is not a reward you earn after collapse; rest is a fundamental biological requirement that fuels creative reasoning and long-term memory retention."
    ],
    keyTakeaway: "Break daunting assignments into 20-minute micro-tasks and schedule protected downtime without feeling guilt."
  },
  {
    id: "art-2",
    title: "Your Rights under Republic Act No. 11036 (Mental Health Act)",
    category: "Mental Health Rights",
    readTime: "4 min read",
    summary: "Understanding Philippine law on student mental health rights, campus support, and non-discrimination.",
    content: [
      "Republic Act No. 11036, known as the Mental Health Act of the Philippines, affirms that mental health is a fundamental human right of every Filipino citizen.",
      "Under Section 24 and 25, educational institutions are mandated to raise awareness on mental health issues, identify individuals at risk of psychosocial distress, and provide supportive, non-punitive campus counseling environments.",
      "Students have the right to confidential psychosocial support, non-discrimination in academic standing due to mental health conditions, and reasonable academic accommodations during recovery."
    ],
    keyTakeaway: "Seeking mental health care on campus is a protected legal right, free from academic penalty or stigma."
  },
  {
    id: "art-3",
    title: "The Science of 5-Minute Micro-Mindfulness",
    category: "Mindfulness",
    readTime: "2 min read",
    summary: "How brief nervous system resets can halt cortisol spikes during study marathons.",
    content: [
      "You don't need to meditate on a mountain for hours to reshape your nervous system. Clinical studies show that even 120 seconds of conscious diaphragmatic breathing activates the vagus nerve, slowing heart rate and lowering blood pressure.",
      "When anxiety begins during an exam or presentation, your amygdala reacts as if facing a physical threat. Slow, extended exhalations signal to the brain that the immediate environment is safe.",
      "Practicing the 4-7-8 breathing method or the 5-4-3-2-1 grounding technique pulls the prefrontal cortex back online, returning clarity and problem-solving capacity."
    ],
    keyTakeaway: "Lengthening your exhalation instantly triggers your parasympathetic calming response."
  },
  {
    id: "art-4",
    title: "Sleep Hygiene & The Student Brain",
    category: "Healthy Habits",
    readTime: "3 min read",
    summary: "Why pulling 'all-nighters' harms academic retention and simple habits to reset your circadian clock.",
    content: [
      "While pulling all-nighters is a common college stereotype, neuroscientific studies demonstrate that sleep deprivation cuts memory consolidation by up to 40%.",
      "During deep REM and slow-wave sleep, the brain's glymphatic system clears metabolic waste and transfers short-term study notes into durable long-term storage.",
      "Try the '10-3-2-1' rule: No caffeine 10 hours before bed, no heavy food 3 hours before, no studying in bed 2 hours before, and screen dimming 1 hour before sleep."
    ],
    keyTakeaway: "Consistent 7-8 hours of sleep outperforms cramming by strengthening neural memory networks."
  }
];

export const INITIAL_MOOD_OPTIONS = [
  { score: 10, label: "Radiant & Thriving", emoji: "✨", color: "bg-emerald-50 text-emerald-700 border-emerald-300" },
  { score: 8, label: "Calm & Content", emoji: "🌿", color: "bg-teal-50 text-teal-700 border-teal-300" },
  { score: 6, label: "Steady & Neutral", emoji: "⛅", color: "bg-sky-50 text-sky-700 border-sky-300" },
  { score: 4, label: "Stressed / Tired", emoji: "🌧️", color: "bg-amber-50 text-amber-700 border-amber-300" },
  { score: 2, label: "Overwhelmed / Low", emoji: "⛈️", color: "bg-rose-50 text-rose-700 border-rose-300" },
];

export const FEELING_TAGS = [
  "Overwhelmed", "Optimistic", "Exhausted", "Grateful", "Productive",
  "Anxious", "Peaceful", "Unmotivated", "Hopeful", "Scattered",
  "Lonely", "Energized", "Pressured", "Supported", "Restless"
];

export const TRIGGER_TAGS = [
  "Academics / Exams", "Thesis / Projects", "Sleep Deprivation", "Family & Home",
  "Commute / Travel", "Financial Stress", "Social / Friends", "Future Uncertainty",
  "Physical Health", "Campus Workload"
];

export const DAILY_AFFIRMATIONS = [
  "My worth is not defined by my GPA, grades, or productivity.",
  "I am allowed to take up space, ask for help, and pause when I am tired.",
  "One step at a time is enough to move mountains.",
  "I honor my mind and body by taking gentle care of myself today.",
  "It is okay if all I did today was breathe and do my best.",
];
