import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Wind, 
  Compass, 
  BookOpen, 
  Volume2, 
  ArrowRight, 
  Smile, 
  Heart, 
  Bot, 
  Calendar,
  Flame,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { MoodEntry, JournalEntry, AIRecommendation } from "../types";
import { DAILY_AFFIRMATIONS } from "../data/wellnessContent";

interface DashboardViewProps {
  moods: MoodEntry[];
  journals: JournalEntry[];
  streakDays: number;
  onNavigateTab: (tab: "mood" | "journal" | "activities" | "ai" | "reports", subTab?: string) => void;
  onQuickLogMood: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  moods,
  journals,
  streakDays,
  onNavigateTab,
  onQuickLogMood,
}) => {
  const [affirmation, setAffirmation] = useState(DAILY_AFFIRMATIONS[0]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // Pick affirmation
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setAffirmation(DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length]);
  }, []);

  // Fetch AI-assisted personalized suggestions
  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const recentMoods = moods.slice(0, 5).map((m) => ({
        score: m.score,
        label: m.label,
        feelings: m.feelings,
        triggers: m.triggers,
      }));
      const recentJournals = journals.slice(0, 3).map((j) => ({
        title: j.title,
        tags: j.tags,
      }));

      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recentMoods, recentJournals }),
      });

      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.warn("Failed to load recs, using default:", e);
      setRecommendations([
        {
          title: "Box Breathing Reset",
          category: "Breathing",
          actionType: "breathing",
          duration: "3 mins",
          reason: "Rapidly balances autonomic nervous system tone during study periods.",
          tip: "Inhale 4s, Hold 4s, Exhale 4s, Rest 4s.",
        },
        {
          title: "5-4-3-2-1 Sensory Grounding",
          category: "Mindfulness",
          actionType: "grounding",
          duration: "4 mins",
          reason: "Reconnects mental attention to your immediate surroundings.",
          tip: "Acknowledge five colors you see in your room right now.",
        },
        {
          title: "Mindful Brain Dump Journal",
          category: "Journaling",
          actionType: "journal",
          duration: "5 mins",
          reason: "Releasing thoughts to page halts rumination loops.",
          tip: "List 3 small things that went well today.",
        },
      ]);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [moods.length, journals.length]);

  const latestMood = moods[0];

  return (
    <div id="dashboard-view-container" className="space-y-6">
      {/* Welcome & Affirmation Card */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Mindful Affirmation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-white">
            "{affirmation}"
          </h2>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-talk-ai-btn"
              onClick={() => onNavigateTab("ai")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-xs hover:bg-teal-50 transition-colors"
            >
              <Bot className="w-4 h-4 text-teal-600" />
              Chat with MentAlly AI
            </button>
            <button
              id="dashboard-breathe-btn"
              onClick={() => onNavigateTab("activities", "breathing")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600/40 hover:bg-teal-600/60 border border-teal-400/30 text-white font-bold text-xs transition-colors"
            >
              <Wind className="w-4 h-4" />
              2-Min Breathing Reset
            </button>
          </div>
        </div>
      </div>

      {/* Quick Check-in & Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Latest Mood */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Mood</span>
              {latestMood ? (
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  {latestMood.score}/10
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Pending Check-in
                </span>
              )}
            </div>
            {latestMood ? (
              <div className="flex items-center gap-3 my-2">
                <span className="text-3xl">{latestMood.emoji}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{latestMood.label}</h4>
                  <p className="text-[11px] text-slate-500">
                    {latestMood.feelings.slice(0, 2).join(", ") || "Recorded today"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-2">
                <h4 className="text-sm font-bold text-slate-900">How are you feeling?</h4>
                <p className="text-xs text-slate-500">Take 30 seconds to log today's emotional weather.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab("mood")}
            className="w-full mt-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            {latestMood ? "Update Mood Log" : "Log Check-in Now"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Journal Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Reflective Journal</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                {journals.length} Saved
              </span>
            </div>
            <div className="my-2">
              <h4 className="text-sm font-bold text-slate-900">Clear your mental space</h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {journals[0] ? `Latest: "${journals[0].title}"` : "Writing about academic stressors reduces anxiety."}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("journal")}
            className="w-full mt-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            Open Journal
          </button>
        </div>

        {/* Quick Grounding & Calming Sounds */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sensory Calming</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Interactive
              </span>
            </div>
            <div className="my-2">
              <h4 className="text-sm font-bold text-slate-900">Grounding & Soundscapes</h4>
              <p className="text-xs text-slate-500">
                5-4-3-2-1 check-off and soothing campus rain audio.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("activities", "grounding")}
            className="w-full mt-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Start Grounding
          </button>
        </div>
      </div>

      {/* AI-Assisted Personalized Suggestions (Scope #5) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">AI-Assisted Personalized Recommendations</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                Tailored for You
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Suggestions dynamically curated based on your recent mood patterns and college stressors.
            </p>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={isLoadingRecs}
            className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh recommendations"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingRecs ? "animate-spin text-teal-600" : ""}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-teal-300 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-800">
                    {rec.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{rec.duration}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{rec.reason}</p>
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-[10px] text-slate-500 italic">
                  💡 {rec.tip}
                </div>
              </div>

              <button
                onClick={() => {
                  if (rec.actionType === "breathing") onNavigateTab("activities", "breathing");
                  else if (rec.actionType === "grounding") onNavigateTab("activities", "grounding");
                  else if (rec.actionType === "sounds") onNavigateTab("activities", "ambient");
                  else onNavigateTab("journal");
                }}
                className="mt-3 w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
              >
                Begin Activity
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
