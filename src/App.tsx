import React, { useState, useEffect } from "react";
import { 
  Home, 
  Heart, 
  BookOpen, 
  Wind, 
  Bot, 
  BarChart3, 
  ShieldAlert, 
  Smartphone, 
  Sparkles,
  GraduationCap
} from "lucide-react";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { MoodTracker } from "./components/MoodTracker";
import { JournalView } from "./components/JournalView";
import { SelfCareActivities } from "./components/SelfCareActivities";
import { AIAssistant } from "./components/AIAssistant";
import { ReportsView } from "./components/ReportsView";
import { EmergencyModal } from "./components/EmergencyModal";
import { AboutModal } from "./components/AboutModal";
import { MoodEntry, JournalEntry } from "./types";

type MainTab = "dashboard" | "mood" | "journal" | "activities" | "ai" | "reports";

const INITIAL_MOODS: MoodEntry[] = [
  {
    id: "m-1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    score: 6,
    label: "Steady & Neutral",
    emoji: "⛅",
    feelings: ["Productive", "Pressured"],
    triggers: ["Academics / Exams", "Campus Workload"],
    note: "Finished thesis chapter draft. Feeling a bit tired but glad it's submitted.",
  },
  {
    id: "m-2",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    score: 8,
    label: "Calm & Content",
    emoji: "🌿",
    feelings: ["Grateful", "Peaceful"],
    triggers: ["Social / Friends", "Sleep Deprivation"],
    note: "Got 8 hours of solid sleep and had lunch with college friends.",
  },
];

const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: "j-1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    title: "Navigating Junior Year Demands",
    content: "Sometimes it feels like every professor assigns major projects during the exact same week. Today I practiced stepping back and focusing on just one assignment for 30 minutes instead of panicking over everything at once. Taking a short walk around campus helped reset my focus.",
    prompt: "What is one gentle boundary you can set with your academic workload?",
    tags: ["Academics", "Mindfulness", "Self-Care"],
    moodTag: "Steady & Neutral",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [activitiesSubTab, setActivitiesSubTab] = useState<"breathing" | "grounding" | "ambient" | "articles">("breathing");
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Local storage persisted state
  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem("mentally_moods");
      return saved ? JSON.parse(saved) : INITIAL_MOODS;
    } catch {
      return INITIAL_MOODS;
    }
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem("mentally_journals");
      return saved ? JSON.parse(saved) : INITIAL_JOURNALS;
    } catch {
      return INITIAL_JOURNALS;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mentally_streak");
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [activitiesCompletedCount, setActivitiesCompletedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mentally_activities_count");
      return saved ? parseInt(saved, 10) : 8;
    } catch {
      return 8;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("mentally_moods", JSON.stringify(moods));
    } catch (e) {}
  }, [moods]);

  useEffect(() => {
    try {
      localStorage.setItem("mentally_journals", JSON.stringify(journals));
    } catch (e) {}
  }, [journals]);

  useEffect(() => {
    try {
      localStorage.setItem("mentally_streak", streakDays.toString());
      localStorage.setItem("mentally_activities_count", activitiesCompletedCount.toString());
    } catch (e) {}
  }, [streakDays, activitiesCompletedCount]);

  // Handlers
  const handleAddMood = (entryData: Omit<MoodEntry, "id" | "timestamp">) => {
    const newEntry: MoodEntry = {
      ...entryData,
      id: "m-" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setMoods([newEntry, ...moods]);
  };

  const handleDeleteMood = (id: string) => {
    setMoods(moods.filter((m) => m.id !== id));
  };

  const handleAddJournal = (entryData: Omit<JournalEntry, "id" | "timestamp">) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: "j-" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setJournals([newEntry, ...journals]);
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(journals.filter((j) => j.id !== id));
  };

  const handleActivityCompleted = (name: string) => {
    setActivitiesCompletedCount((prev) => prev + 1);
  };

  const handleNavigate = (tab: MainTab, subTab?: string) => {
    setActiveTab(tab);
    if (subTab && (subTab === "breathing" || subTab === "grounding" || subTab === "ambient" || subTab === "articles")) {
      setActivitiesSubTab(subTab as any);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      {/* Top Banner with Capsule Attribution */}
      <div className="bg-teal-900 text-teal-100 text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <GraduationCap className="w-3.5 h-3.5 text-teal-300" />
        <span>Pateros Technological College • Institute of Information and Computing Technology</span>
        <span className="hidden sm:inline opacity-70">|</span>
        <span className="hidden sm:inline opacity-90">MentAlly Capsule Project by JABINES, ANGELOU FRANCIS</span>
      </div>

      {/* Main Header */}
      <Header
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        streakDays={streakDays}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Viewport wrapper: Either Phone Frame or Responsive Full Width */}
      <main className={`flex-1 ${isMobileFrame ? "py-6 flex justify-center items-start" : "max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 pb-24"}`}>
        <div
          className={
            isMobileFrame
              ? "w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col min-h-[840px] relative pb-20"
              : "w-full"
          }
        >
          {/* Simulated Mobile Status Notch when in phone mode */}
          {isMobileFrame && (
            <div className="w-full bg-slate-900 text-white text-[10px] px-6 py-2 flex items-center justify-between font-mono shrink-0">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-800 rounded-full" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Tab Navigation Pill Bar (Top Desktop / In-frame) */}
          <div className="p-3 sm:p-0 mb-6">
            <nav className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
              <button
                id="nav-tab-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "dashboard"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-tab-mood"
                onClick={() => setActiveTab("mood")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "mood"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Mood Track</span>
              </button>

              <button
                id="nav-tab-journal"
                onClick={() => setActiveTab("journal")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "journal"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Journal</span>
              </button>

              <button
                id="nav-tab-activities"
                onClick={() => setActiveTab("activities")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "activities"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Self-Care</span>
              </button>

              <button
                id="nav-tab-ai"
                onClick={() => setActiveTab("ai")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "ai"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Companion</span>
              </button>

              <button
                id="nav-tab-reports"
                onClick={() => setActiveTab("reports")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "reports"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Reports</span>
              </button>
            </nav>
          </div>

          {/* Active View Router */}
          <div className={isMobileFrame ? "px-4 flex-1 overflow-y-auto" : "w-full"}>
            {activeTab === "dashboard" && (
              <DashboardView
                moods={moods}
                journals={journals}
                streakDays={streakDays}
                onNavigateTab={handleNavigate}
                onQuickLogMood={() => setActiveTab("mood")}
              />
            )}

            {activeTab === "mood" && (
              <MoodTracker
                moods={moods}
                onAddMood={handleAddMood}
                onDeleteMood={handleDeleteMood}
                onOpenActivitiesWithSuggestion={(action) => handleNavigate("activities", action)}
              />
            )}

            {activeTab === "journal" && (
              <JournalView
                entries={journals}
                onAddEntry={handleAddJournal}
                onDeleteEntry={handleDeleteJournal}
                currentMoodLabel={moods[0]?.label}
              />
            )}

            {activeTab === "activities" && (
              <SelfCareActivities
                onActivityCompleted={handleActivityCompleted}
                defaultSubTab={activitiesSubTab}
              />
            )}

            {activeTab === "ai" && (
              <AIAssistant
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onOpenBreathing={() => handleNavigate("activities", "breathing")}
                onOpenGrounding={() => handleNavigate("activities", "grounding")}
                currentMoodLabel={moods[0]?.label}
              />
            )}

            {activeTab === "reports" && (
              <ReportsView
                moods={moods}
                journals={journals}
                streakDays={streakDays}
                activitiesCompletedCount={activitiesCompletedCount}
              />
            )}
          </div>
        </div>
      </main>

      {/* Floating Bottom Mobile Bar for touch convenience */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around sm:hidden">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === "dashboard" ? "text-teal-700" : "text-slate-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab("mood")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === "mood" ? "text-teal-700" : "text-slate-400"
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Mood</span>
        </button>

        <button
          onClick={() => setActiveTab("activities")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === "activities" ? "text-teal-700" : "text-slate-400"
          }`}
        >
          <Wind className="w-5 h-5" />
          <span>Self-Care</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === "ai" ? "text-teal-700" : "text-slate-400"
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>AI Chat</span>
        </button>

        <button
          onClick={() => setActiveTab("journal")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeTab === "journal" ? "text-teal-700" : "text-slate-400"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Journal</span>
        </button>
      </div>

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
