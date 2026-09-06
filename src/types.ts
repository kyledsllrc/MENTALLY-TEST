export type MoodScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string
  score: MoodScore;
  label: string; // e.g., 'Very Low', 'Stressed', 'Neutral', 'Calm', 'Joyful'
  emoji: string;
  feelings: string[]; // e.g., 'Overwhelmed', 'Exhausted', 'Hopeful'
  triggers: string[]; // e.g., 'Exams/Academics', 'Sleep', 'Social'
  note?: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  prompt?: string;
  moodTag?: string;
  tags: string[];
}

export interface AIRecommendation {
  title: string;
  category: "Breathing" | "Mindfulness" | "Relaxation" | "Journaling";
  actionType: "breathing" | "grounding" | "sounds" | "journal";
  duration: string;
  reason: string;
  tip: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Article {
  id: string;
  title: string;
  category: "Stress Management" | "Mindfulness" | "Healthy Habits" | "Mental Health Rights";
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaway: string;
}

export interface EmergencyContact {
  name: string;
  organization: string;
  contactNumber: string;
  description: string;
  availability: string;
  isTollFree?: boolean;
}

export interface ScreenerResult {
  id: string;
  type: "PHQ-9" | "GAD-7";
  timestamp: string;
  score: number;
  severity: string;
  interpretation: string;
  recommendation: string;
  answers: number[];
}

export interface CBTThoughtRecord {
  id: string;
  timestamp: string;
  situation: string;
  automaticThought: string;
  emotion: string;
  cognitiveDistortion: string;
  evidenceAgainst: string;
  balancedThought: string;
  outcomeEmotion: string;
}

export interface DailyHabitLog {
  date: string;
  sleepHours: number;
  waterGlasses: number;
  studyBreaksTaken: number;
  academicStressLevel: number;
}

export interface PTCCampusResource {
  id: string;
  title: string;
  department: string;
  location: string;
  contactEmail: string;
  contactNumber: string;
  hours: string;
  services: string[];
  notes: string;
}
