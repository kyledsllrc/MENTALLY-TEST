import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Award, 
  BookOpen, 
  Wind, 
  Printer, 
  Download,
  AlertCircle,
  Clock,
  HeartHandshake
} from "lucide-react";
import { MoodEntry, JournalEntry } from "../types";

interface ReportsViewProps {
  moods: MoodEntry[];
  journals: JournalEntry[];
  streakDays: number;
  activitiesCompletedCount: number;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  moods,
  journals,
  streakDays,
  activitiesCompletedCount,
}) => {
  // Compute analytics
  const totalLogs = moods.length;
  const avgScore = totalLogs > 0
    ? (moods.reduce((acc, m) => acc + m.score, 0) / totalLogs).toFixed(1)
    : "—";

  // Trigger counts
  const triggerMap: Record<string, number> = {};
  moods.forEach((m) => {
    m.triggers.forEach((t) => {
      triggerMap[t] = (triggerMap[t] || 0) + 1;
    });
  });
  const sortedTriggers = Object.entries(triggerMap).sort((a, b) => b[1] - a[1]);

  // Feelings counts
  const feelingsMap: Record<string, number> = {};
  moods.forEach((m) => {
    m.feelings.forEach((f) => {
      feelingsMap[f] = (feelingsMap[f] || 0) + 1;
    });
  });
  const sortedFeelings = Object.entries(feelingsMap).sort((a, b) => b[1] - a[1]);

  // Last 7 entries for SVG chart
  const recentDays = [...moods].reverse().slice(-7);
  const chartPoints = recentDays.map((entry, idx) => {
    const x = recentDays.length > 1 ? (idx / (recentDays.length - 1)) * 260 + 20 : 150;
    const y = 140 - (entry.score / 10) * 110;
    return { x, y, score: entry.score, label: entry.label, date: new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: "short" }) };
  });

  const pathD = chartPoints.length > 1
    ? chartPoints.reduce((acc, pt, i) => i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, "")
    : "";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      appName: "MentAlly Mental Wellness App",
      generatedAt: new Date().toISOString(),
      summary: {
        totalMoodLogs: totalLogs,
        averageMoodScore: avgScore,
        activeStreakDays: streakDays,
        journalEntriesCount: journals.length,
        activitiesCompletedCount,
      },
      moodLogs: moods,
      journalEntries: journals,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentally-student-wellness-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reports-view-container" className="space-y-6">
      {/* Top Banner with Print / Export action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Wellness Summary & Progress Report
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized mood insights, emotional triggers, and self-care milestone tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
            title="Download confidential records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export Data</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            title="Print Counselor Consultation Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block mb-0.5 sm:mb-1">Average Mood</span>
          <div className="text-xl sm:text-2xl font-black text-teal-700">{avgScore} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
          <span className="text-[10px] text-teal-600 font-medium">
            {totalLogs === 0 ? "No records yet" : `Based on ${totalLogs} logs`}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block mb-0.5 sm:mb-1">Active Streak</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">🔥 {streakDays} <span className="text-xs font-normal text-slate-400">days</span></div>
          <span className="text-[10px] text-amber-700 font-medium">
            {streakDays === 0 ? "Log today to start" : "Consecutive days"}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block mb-0.5 sm:mb-1">Journal Entries</span>
          <div className="text-xl sm:text-2xl font-black text-sky-700">{journals.length}</div>
          <span className="text-[10px] text-sky-600 font-medium">Reflective notes</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block mb-0.5 sm:mb-1">Self-Care Actions</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">{activitiesCompletedCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Breaths & exercises</span>
        </div>
      </div>

      {/* SVG Mood Trend Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Emotional Trajectory (Recent Logs)
            </h4>
            <p className="text-xs text-slate-500">Visualizing fluctuations and recovery patterns</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Scale: 1 (Low) to 10 (Peak)</span>
        </div>

        {chartPoints.length < 2 ? (
          <div className="h-40 flex items-center justify-center bg-slate-50 rounded-xl text-xs text-slate-400">
            Log at least 2 mood check-ins to generate your trajectory line chart!
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 300 160" className="w-full h-44 overflow-visible">
              {/* Grid Lines */}
              <line x1="20" y1="30" x2="280" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="85" x2="280" y2="85" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="140" x2="280" y2="140" stroke="#e2e8f0" strokeWidth="1" />

              {/* Trend line */}
              <path
                d={pathD}
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#0d9488"
                    strokeWidth="3"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 9}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#0f766e"
                  >
                    {pt.score}
                  </text>
                  <text
                    x={pt.x}
                    y="155"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748b"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Triggers & Feelings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frequent Influencing Factors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900">Primary Stressors & Triggers</h4>
          <p className="text-xs text-slate-500">Factors most commonly linked to lower mood states</p>
          {sortedTriggers.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No triggers logged yet.</div>
          ) : (
            <div className="space-y-2 pt-1">
              {sortedTriggers.slice(0, 5).map(([trigger, count]) => {
                const percentage = Math.round((count / totalLogs) * 100);
                return (
                  <div key={trigger} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{trigger}</span>
                      <span className="text-slate-400">{count} logs ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Emotional States */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900">Dominant Feelings</h4>
          <p className="text-xs text-slate-500">The most recurring affective states you reported</p>
          {sortedFeelings.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No feeling tags logged yet.</div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {sortedFeelings.slice(0, 8).map(([feeling, count]) => (
                <div
                  key={feeling}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{feeling}</span>
                  <span className="w-4 h-4 rounded-full bg-teal-200 text-teal-800 text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* College Academic Guidance Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <HeartHandshake className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-800 block">Sharing with your Campus Guidance Counselor</strong>
          <p className="leading-relaxed">
            You can print or show this summary during your consultation at your university guidance office or student wellness center (under CHED Project GROWS & GAYON guidelines). It offers concrete data on your sleep, academic workload, and self-care frequency.
          </p>
        </div>
      </div>
    </div>
  );
};
