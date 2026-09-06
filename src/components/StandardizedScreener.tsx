import React, { useState } from "react";
import { 
  ClipboardCheck, 
  AlertCircle, 
  HelpCircle, 
  RotateCcw, 
  Building2, 
  CheckCircle,
  FileCheck
} from "lucide-react";
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, PTC_RESOURCES } from "../data/ptcData";
import { ScreenerResult } from "../types";

const FREQUENCY_OPTIONS = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

interface StandardizedScreenerProps {
  onSaveResult?: (result: ScreenerResult) => void;
  onNavigateGuidance?: () => void;
}

export const StandardizedScreener: React.FC<StandardizedScreenerProps> = ({
  onSaveResult,
  onNavigateGuidance,
}) => {
  const [activeType, setActiveType] = useState<"PHQ-9" | "GAD-7">("PHQ-9");
  const questions = activeType === "PHQ-9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [isCompleted, setIsCompleted] = useState(false);
  const [history, setHistory] = useState<ScreenerResult[]>(() => {
    try {
      const saved = localStorage.getItem("mentally_screeners");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSelectOption = (qIdx: number, val: number) => {
    const updated = [...answers];
    updated[qIdx] = val;
    setAnswers(updated);
  };

  const handleTypeChange = (type: "PHQ-9" | "GAD-7") => {
    setActiveType(type);
    const newLen = type === "PHQ-9" ? PHQ9_QUESTIONS.length : GAD7_QUESTIONS.length;
    setAnswers(Array(newLen).fill(-1));
    setIsCompleted(false);
  };

  const allAnswered = answers.every((a) => a !== -1);
  const totalScore = answers.reduce((acc, curr) => acc + (curr !== -1 ? curr : 0), 0);

  const getInterpretation = () => {
    if (activeType === "PHQ-9") {
      if (totalScore <= 4) {
        return {
          severity: "Minimal / Subclinical Depression",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          desc: "Your mood appears stable and within normal college variations.",
          rec: "Continue current healthy habits, sleep routines, and social connections.",
        };
      } else if (totalScore <= 9) {
        return {
          severity: "Mild Depression Symptoms",
          color: "text-sky-700 bg-sky-50 border-sky-200",
          desc: "You are experiencing occasional mood dips or fatigue related to college demands.",
          rec: "Incorporate daily 10-minute breaks, sleep hygiene, and journaling in MentAlly.",
        };
      } else if (totalScore <= 14) {
        return {
          severity: "Moderate Depression Symptoms",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          desc: "Academic burnout and feelings of exhaustion are significantly impacting your routine.",
          rec: "Consider scheduling a confidential conversation at PTC Guidance Center (Room 204).",
        };
      } else if (totalScore <= 19) {
        return {
          severity: "Moderately Severe Depression Symptoms",
          color: "text-orange-700 bg-orange-50 border-orange-200",
          desc: "Your emotional burden is substantial and likely affecting academic performance.",
          rec: "We strongly advise connecting with the PTC Guidance Office or NCMH hotline (1553).",
        };
      } else {
        return {
          severity: "Severe Depression Symptoms",
          color: "text-rose-700 bg-rose-50 border-rose-200",
          desc: "Significant clinical distress noted.",
          rec: "Please reach out immediately to a trusted counselor, the PTC Clinic, or call 1553.",
        };
      }
    } else {
      // GAD-7
      if (totalScore <= 4) {
        return {
          severity: "Minimal Anxiety",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          desc: "Normal situational worry manageable with standard relaxation habits.",
          rec: "Practice regular study breaks and box breathing before tests.",
        };
      } else if (totalScore <= 9) {
        return {
          severity: "Mild Anxiety Symptoms",
          color: "text-sky-700 bg-sky-50 border-sky-200",
          desc: "Noticeable restlessness or racing thoughts around exams and deadlines.",
          rec: "Use the MentAlly 5-4-3-2-1 Sensory Grounding and CBT Reframing worksheet.",
        };
      } else if (totalScore <= 14) {
        return {
          severity: "Moderate Anxiety Symptoms",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          desc: "Frequent worry and physical tension interfering with coursework.",
          rec: "Consult with PTC Guidance counselors for time-management and relaxation guidance.",
        };
      } else {
        return {
          severity: "Severe Anxiety Symptoms",
          color: "text-rose-700 bg-rose-50 border-rose-200",
          desc: "Intense anxiety causing high distress or panic feelings.",
          rec: "Please seek support from the PTC Guidance Center (Room 204) or call NCMH 1553.",
        };
      }
    }
  };

  const interpretation = getInterpretation();

  const handleFinish = () => {
    setIsCompleted(true);
    const result: ScreenerResult = {
      id: "scr-" + Date.now(),
      type: activeType,
      timestamp: new Date().toISOString(),
      score: totalScore,
      severity: interpretation.severity,
      interpretation: interpretation.desc,
      recommendation: interpretation.rec,
      answers: [...answers],
    };
    const updated = [result, ...history];
    setHistory(updated);
    try {
      localStorage.setItem("mentally_screeners", JSON.stringify(updated));
    } catch {}
    if (onSaveResult) onSaveResult(result);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(-1));
    setIsCompleted(false);
  };

  return (
    <div id="standardized-screener" className="space-y-6 animate-in fade-in duration-200">
      {/* Disclaimer Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider block">
            Non-Clinical Academic Wellness Screener
          </span>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            The PHQ-9 and GAD-7 are internationally recognized screening tools designed to help recognize patterns of emotional distress. 
            This assessment is <strong>not a medical diagnosis</strong>. For clinical guidance or academic accommodations at Pateros Technological College, please visit the 
            <strong> PTC Guidance & Counseling Center (Room 204)</strong>.
          </p>
        </div>
      </div>

      {/* Switcher & Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => handleTypeChange("PHQ-9")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeType === "PHQ-9" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            PHQ-9 (Mood & Energy)
          </button>
          <button
            onClick={() => handleTypeChange("GAD-7")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeType === "GAD-7" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            GAD-7 (Worry & Anxiety)
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium text-center sm:text-right">
          Over the last <strong>2 weeks</strong>, how often have you been bothered by:
        </div>
      </div>

      {/* Assessment Form */}
      {!isCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-5">
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-snug">{q}</p>
                </div>

                {/* 4 Choices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pl-9">
                  {FREQUENCY_OPTIONS.map((opt) => {
                    const isSelected = answers[idx] === opt.score;
                    return (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => handleSelectOption(idx, opt.score)}
                        className={`p-2.5 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span className={`block text-[9px] mt-0.5 ${isSelected ? "text-teal-200" : "text-slate-400"}`}>
                          +{opt.score} pt
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              {answers.filter((a) => a !== -1).length} of {questions.length} answered
            </span>

            <button
              disabled={!allAnswered}
              onClick={handleFinish}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                allAnswered
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              Compute Screener Score
            </button>
          </div>
        </div>
      ) : (
        /* Completed Results Card */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                Assessment Results
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {activeType} Score: <span className="text-teal-700">{totalScore}</span> / {questions.length * 3}
              </h4>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </button>
          </div>

          {/* Severity Badge */}
          <div className={`p-4 rounded-xl border ${interpretation.color} space-y-1`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{interpretation.severity}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{interpretation.desc}</p>
          </div>

          {/* Campus Recommendation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              PTC Campus Recommended Next Steps:
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">{interpretation.rec}</p>

            {totalScore >= 10 && (
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={onNavigateGuidance}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  Contact PTC Guidance Center (Room 204)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Screeners List */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-teal-600" />
            Previous Screener Records ({history.length})
          </h4>
          <div className="divide-y divide-slate-100">
            {history.slice(0, 5).map((rec) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 mr-2">{rec.type}</span>
                  <span className="text-slate-500">
                    {new Date(rec.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700">Score: {rec.score}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                    {rec.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
