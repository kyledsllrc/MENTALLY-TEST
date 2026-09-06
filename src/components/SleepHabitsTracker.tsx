import React, { useState } from "react";
import { 
  Moon, 
  Droplets, 
  Coffee, 
  Activity, 
  Calendar, 
  CheckCircle,
  TrendingUp,
  Trash2
} from "lucide-react";
import { DailyHabitLog } from "../types";

export const SleepHabitsTracker: React.FC = () => {
  const [logs, setLogs] = useState<DailyHabitLog[]>(() => {
    try {
      const saved = localStorage.getItem("mentally_habits");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const existingToday = logs.find((l) => l.date === todayStr);

  const [sleepHours, setSleepHours] = useState(existingToday ? existingToday.sleepHours : 7);
  const [waterGlasses, setWaterGlasses] = useState(existingToday ? existingToday.waterGlasses : 6);
  const [studyBreaksTaken, setStudyBreaksTaken] = useState(existingToday ? existingToday.studyBreaksTaken : 3);
  const [academicStressLevel, setAcademicStressLevel] = useState(existingToday ? existingToday.academicStressLevel : 5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveToday = () => {
    const newEntry: DailyHabitLog = {
      date: todayStr,
      sleepHours,
      waterGlasses,
      studyBreaksTaken,
      academicStressLevel,
    };

    const filtered = logs.filter((l) => l.date !== todayStr);
    const updated = [newEntry, ...filtered];
    setLogs(updated);
    try {
      localStorage.setItem("mentally_habits", JSON.stringify(updated));
    } catch {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteLog = (dateToDelete: string) => {
    const updated = logs.filter((l) => l.date !== dateToDelete);
    setLogs(updated);
    try {
      localStorage.setItem("mentally_habits", JSON.stringify(updated));
    } catch {}
  };

  const avgSleep = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + curr.sleepHours, 0) / logs.length).toFixed(1)
    : "0";
  const avgWater = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + curr.waterGlasses, 0) / logs.length).toFixed(1)
    : "0";
  const avgBreaks = logs.length > 0
    ? (logs.reduce((acc, curr) => acc + curr.studyBreaksTaken, 0) / logs.length).toFixed(1)
    : "0";

  return (
    <div id="sleep-habits-tracker" className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Avg Sleep</span>
            <Moon className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-900">{avgSleep} <span className="text-xs font-normal text-slate-500">hrs/day</span></p>
          <span className="text-[10px] text-slate-500">Target: 7-8 hrs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Avg Hydration</span>
            <Droplets className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-900">{avgWater} <span className="text-xs font-normal text-slate-500">glasses</span></p>
          <span className="text-[10px] text-slate-500">Target: 8 glasses</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Study Breaks</span>
            <Coffee className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-900">{avgBreaks} <span className="text-xs font-normal text-slate-500">pauses</span></p>
          <span className="text-[10px] text-slate-500">Pomodoro 25/5</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Logged Days</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-900">{logs.length} <span className="text-xs font-normal text-slate-500">days</span></p>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Tracker</span>
        </div>
      </div>

      {/* Daily Check-in Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Today's Academic Wellness Habit Log</h4>
            <p className="text-[11px] text-slate-500">
              Logging date: <strong>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</strong>
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Sleep */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-600" />
                Sleep Duration Last Night
              </label>
              <span className="text-xs font-bold text-indigo-700">{sleepHours} Hours</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>4h (All-nighter)</span>
              <span>7-8h (Recommended)</span>
              <span>10h+</span>
            </div>
          </div>

          {/* Hydration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                Water Glasses Drank
              </label>
              <span className="text-xs font-bold text-sky-700">{waterGlasses} Glasses</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setWaterGlasses(num)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                    waterGlasses >= num
                      ? "bg-sky-500 text-white shadow-xs"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Study Breaks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-600" />
                Study / Screen Breaks Taken
              </label>
              <span className="text-xs font-bold text-amber-700">{studyBreaksTaken} Breaks</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStudyBreaksTaken(Math.max(0, studyBreaksTaken - 1))}
                className="w-9 h-9 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100"
              >
                -
              </button>
              <div className="flex-1 text-center font-bold text-xs bg-slate-50 py-2 rounded-xl border border-slate-200">
                {studyBreaksTaken} pauses (Pomodoro 25/5 or 50/10)
              </div>
              <button
                type="button"
                onClick={() => setStudyBreaksTaken(studyBreaksTaken + 1)}
                className="w-9 h-9 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Academic Stress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-600" />
                Academic Workload Pressure (1 to 10)
              </label>
              <span className="text-xs font-bold text-rose-700">{academicStressLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={academicStressLevel}
              onChange={(e) => setAcademicStressLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>1 (Light)</span>
              <span>5 (Manageable)</span>
              <span>10 (Overwhelmed)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveToday}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Save Today's Habit Log
          </button>
        </div>
      </div>

      {/* History Log Table */}
      {logs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              Recent Daily Logs ({logs.length})
            </h4>
            <span className="text-[11px] text-slate-400">Tap trash icon to remove</span>
          </div>
          <div className="divide-y divide-slate-100">
            {logs.slice(0, 7).map((log, idx) => (
              <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-xs">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="font-bold text-slate-800">
                    {new Date(log.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <button
                    onClick={() => handleDeleteLog(log.date)}
                    className="text-slate-400 hover:text-rose-600 sm:hidden p-1 rounded-lg"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 text-slate-600 text-[11px] sm:text-xs">
                  <span>🌙 {log.sleepHours}h</span>
                  <span>💧 {log.waterGlasses} gls</span>
                  <span>☕ {log.studyBreaksTaken} brks</span>
                  <span className={`font-bold ${log.academicStressLevel >= 7 ? "text-rose-600" : "text-emerald-700"}`}>
                    Stress {log.academicStressLevel}/10
                  </span>
                  <button
                    onClick={() => handleDeleteLog(log.date)}
                    className="hidden sm:inline-flex text-slate-300 hover:text-rose-600 p-1 rounded-lg transition-colors"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
          No daily habit logs recorded yet. Adjust your numbers above and click "Save Today's Habit Log".
        </div>
      )}
    </div>
  );
};
