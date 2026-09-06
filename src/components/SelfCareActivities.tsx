import React, { useState, useEffect, useRef } from "react";
import { 
  Wind, 
  Compass, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  CloudRain, 
  Waves, 
  Trees, 
  ArrowRight,
  Info
} from "lucide-react";
import { soundEngine } from "../utils/audio";
import { WELLNESS_ARTICLES } from "../data/wellnessContent";
import { Article } from "../types";

interface SelfCareActivitiesProps {
  onActivityCompleted?: (name: string) => void;
  defaultSubTab?: "breathing" | "grounding" | "ambient" | "articles";
}

type BreathingTechnique = "box" | "relax" | "coherent";

interface BreathPhase {
  name: string;
  duration: number; // in seconds
  instruction: string;
  action: "inhale" | "hold" | "exhale" | "rest";
}

const TECHNIQUES: Record<BreathingTechnique, { name: string; desc: string; phases: BreathPhase[] }> = {
  box: {
    name: "Box Breathing (4-4-4-4)",
    desc: "Used to regain acute emotional control, lower adrenaline, and enhance academic focus.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "Breathe in deeply through your nose", action: "inhale" },
      { name: "Hold", duration: 4, instruction: "Gently hold your breath with relaxed shoulders", action: "hold" },
      { name: "Exhale", duration: 4, instruction: "Smoothly exhale completely through your mouth", action: "exhale" },
      { name: "Hold", duration: 4, instruction: "Pause and rest before the next breath", action: "rest" },
    ],
  },
  relax: {
    name: "4-7-8 Relaxing Breath",
    desc: "Activates the parasympathetic nervous system; ideal for racing thoughts or sleep preparation.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "Inhale quietly through your nose", action: "inhale" },
      { name: "Hold", duration: 7, instruction: "Keep your breath sustained gently", action: "hold" },
      { name: "Exhale", duration: 8, instruction: "Make an audible whoosh exhalation", action: "exhale" },
    ],
  },
  coherent: {
    name: "Coherent Equilibrium (5-5)",
    desc: "Synchronizes heart-rate variability (HRV) with lung respiration for steady tranquility.",
    phases: [
      { name: "Inhale", duration: 5, instruction: "Gentle, steady diaphragmatic inhalation", action: "inhale" },
      { name: "Exhale", duration: 5, instruction: "Smooth, continuous release of breath", action: "exhale" },
    ],
  },
};

export const SelfCareActivities: React.FC<SelfCareActivitiesProps> = ({
  onActivityCompleted,
  defaultSubTab = "breathing",
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"breathing" | "grounding" | "ambient" | "articles">(defaultSubTab);

  // Breathing state
  const [technique, setTechnique] = useState<BreathingTechnique>("box");
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(TECHNIQUES.box.phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState(5);
  const [groundingInputs, setGroundingInputs] = useState<Record<number, string[]>>({
    5: ["", "", "", "", ""],
    4: ["", "", "", ""],
    3: ["", "", ""],
    2: ["", ""],
    1: [""],
  });
  const [groundingComplete, setGroundingComplete] = useState(false);

  // Ambient sound state
  const [activeAmbiance, setActiveAmbiance] = useState<"rain" | "ocean" | "forest" | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.3);

  // Article reader state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Sync defaultSubTab if updated externally
  useEffect(() => {
    setActiveSubTab(defaultSubTab);
  }, [defaultSubTab]);

  // Breathing timer loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPhases = TECHNIQUES[technique].phases;
  const currentPhase = currentPhases[phaseIndex];

  const phaseIndexRef = useRef(phaseIndex);
  phaseIndexRef.current = phaseIndex;

  const secondsLeftRef = useRef(secondsLeftInPhase);
  secondsLeftRef.current = secondsLeftInPhase;

  const onActivityCompletedRef = useRef(onActivityCompleted);
  onActivityCompletedRef.current = onActivityCompleted;

  useEffect(() => {
    if (!isBreathing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const currentVal = secondsLeftRef.current;
      if (currentVal <= 1) {
        const nextIndex = (phaseIndexRef.current + 1) % currentPhases.length;
        setPhaseIndex(nextIndex);
        setSecondsLeftInPhase(currentPhases[nextIndex].duration);

        if (nextIndex === 0) {
          setCompletedCycles((prev) => {
            const updated = prev + 1;
            if (updated % 3 === 0 && onActivityCompletedRef.current) {
              setTimeout(() => {
                onActivityCompletedRef.current?.("Completed 3 Breathing Cycles");
              }, 0);
            }
            return updated;
          });
        }
        if (soundEnabled) {
          soundEngine.playChime(nextIndex === 0 ? 528 : 440);
        }
      } else {
        setSecondsLeftInPhase(currentVal - 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathing, technique, currentPhases, soundEnabled]);

  const toggleBreathing = () => {
    if (!isBreathing) {
      if (soundEnabled) soundEngine.playChime(440);
      setIsBreathing(true);
    } else {
      setIsBreathing(false);
    }
  };

  const resetBreathing = () => {
    setIsBreathing(false);
    setPhaseIndex(0);
    setSecondsLeftInPhase(TECHNIQUES[technique].phases[0].duration);
    setCompletedCycles(0);
  };

  const handleTechniqueChange = (tech: BreathingTechnique) => {
    setIsBreathing(false);
    setTechnique(tech);
    setPhaseIndex(0);
    setSecondsLeftInPhase(TECHNIQUES[tech].phases[0].duration);
  };

  // Ambient sound handler
  const toggleSoundscape = (type: "rain" | "ocean" | "forest") => {
    if (activeAmbiance === type) {
      soundEngine.stopAmbiance();
      setActiveAmbiance(null);
    } else {
      soundEngine.startAmbiance(type, ambientVolume);
      setActiveAmbiance(type);
      if (onActivityCompleted) {
        onActivityCompleted(`Listened to ${type} soundscape`);
      }
    }
  };

  const handleVolumeChange = (v: number) => {
    setAmbientVolume(v);
    soundEngine.setVolume(v);
  };

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAmbiance();
    };
  }, []);

  return (
    <div id="self-care-container" className="space-y-6">
      {/* Sub navigation header */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          id="tab-btn-breathing"
          onClick={() => setActiveSubTab("breathing")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === "breathing"
              ? "bg-white text-teal-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Wind className="w-4 h-4 text-teal-600" />
          Breathing Exercises
        </button>

        <button
          id="tab-btn-grounding"
          onClick={() => setActiveSubTab("grounding")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === "grounding"
              ? "bg-white text-teal-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          5-4-3-2-1 Grounding
        </button>

        <button
          id="tab-btn-ambient"
          onClick={() => setActiveSubTab("ambient")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === "ambient"
              ? "bg-white text-teal-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Volume2 className="w-4 h-4 text-sky-600" />
          Relaxation Sounds
        </button>

        <button
          id="tab-btn-articles"
          onClick={() => setActiveSubTab("articles")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === "articles"
              ? "bg-white text-teal-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          Wellness Guides & Rights
        </button>
      </div>

      {/* 1. BREATHING COACH TAB */}
      {activeSubTab === "breathing" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Technique Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(Object.keys(TECHNIQUES) as BreathingTechnique[]).map((key) => {
              const tech = TECHNIQUES[key];
              const isSelected = technique === key;
              return (
                <button
                  key={key}
                  id={`technique-card-${key}`}
                  onClick={() => handleTechniqueChange(key)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-teal-50/80 border-teal-500 shadow-xs ring-1 ring-teal-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? "text-teal-950" : "text-slate-800"}`}>
                      {tech.name}
                    </span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{tech.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive Breathing Sphere Visualizer */}
          <div className="bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border border-teal-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
            {/* Ambient Background Wave */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Sound toggle & Cycle status */}
            <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-6 z-10">
              <span className="font-semibold text-slate-700 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
                Completed: <strong className="text-teal-700">{completedCycles}</strong> {completedCycles === 1 ? "cycle" : "cycles"}
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                title="Toggle breath pacing chime"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Bell: On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bell: Off</span>
                  </>
                )}
              </button>
            </div>

            {/* Breathing Circle */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center my-4">
              {/* Outer pulsing ripple */}
              <div
                className={`absolute inset-0 rounded-full bg-teal-200/40 transition-all duration-1000 ease-in-out ${
                  currentPhase.action === "inhale"
                    ? "scale-105 opacity-80"
                    : currentPhase.action === "hold"
                    ? "scale-100 opacity-60"
                    : currentPhase.action === "exhale"
                    ? "scale-75 opacity-30"
                    : "scale-80 opacity-20"
                }`}
              />

              {/* Main Breathing Core */}
              <div
                className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-all duration-1000 ease-in-out z-10 ${
                  currentPhase.action === "inhale"
                    ? "bg-gradient-to-tr from-teal-500 to-emerald-400 text-white scale-110 shadow-teal-500/30"
                    : currentPhase.action === "hold"
                    ? "bg-gradient-to-tr from-sky-500 to-teal-500 text-white scale-105 shadow-sky-500/20"
                    : currentPhase.action === "exhale"
                    ? "bg-gradient-to-tr from-teal-600 to-teal-800 text-white scale-90 shadow-slate-400/20"
                    : "bg-slate-200 text-slate-700 scale-85 shadow-xs"
                }`}
              >
                <span className="text-xs uppercase tracking-widest font-bold opacity-85">
                  {isBreathing ? currentPhase.name : "Ready"}
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold my-1 tracking-tight">
                  {isBreathing ? secondsLeftInPhase : currentPhases[0].duration}
                </span>
                <span className="text-[11px] opacity-90 px-3 line-clamp-1 font-medium">
                  {isBreathing ? (currentPhase.action === "inhale" ? "Deep In" : currentPhase.action === "exhale" ? "Slow Out" : "Hold Still") : "Tap Start"}
                </span>
              </div>
            </div>

            {/* Instruction text */}
            <div className="text-center my-3 max-w-sm">
              <p className="text-sm font-semibold text-slate-800">
                {isBreathing ? currentPhase.instruction : "Find a comfortable posture and relax your jaw."}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isBreathing
                  ? `Phase duration: ${currentPhase.duration} seconds • Breathe calmly`
                  : "Allow your breath to flow naturally into your lower belly."}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3 mt-4 z-10">
              <button
                id="breathing-toggle-btn"
                onClick={toggleBreathing}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                  isBreathing
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
              >
                {isBreathing ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    Pause Breath
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Start Breathing
                  </>
                )}
              </button>

              <button
                id="breathing-reset-btn"
                onClick={resetBreathing}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GROUNDING EXERCISE TAB */}
      {activeSubTab === "grounding" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">5-4-3-2-1 Sensory Grounding Technique</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                When anxiety strikes, this simple sensory inventory disconnects racing mental chatter and grounds you in physical reality.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Step {6 - groundingStep} of 5
            </span>
          </div>

          {!groundingComplete ? (
            <div className="space-y-5">
              {/* Step indicator pills */}
              <div className="flex items-center justify-between gap-1">
                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    onClick={() => setGroundingStep(s)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      groundingStep === s
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : groundingStep < s
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {s} {s === 5 ? "See" : s === 4 ? "Feel" : s === 3 ? "Hear" : s === 2 ? "Smell" : "Taste"}
                  </button>
                ))}
              </div>

              {/* Step Prompt Details */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {groundingStep}
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {groundingStep === 5 && "Look around you. Name 5 things you can SEE:"}
                    {groundingStep === 4 && "Tune into your body. Name 4 things you can physically TOUCH or FEEL:"}
                    {groundingStep === 3 && "Close your eyes if helpful. Name 3 distinct sounds you can HEAR:"}
                    {groundingStep === 2 && "Inhale gently through your nose. Name 2 things you can SMELL:"}
                    {groundingStep === 1 && "Focus on your mouth. Name 1 thing you can TASTE right now:"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 pl-8">
                  {groundingStep === 5 && "Examples: The pattern on your notebook, your phone screen light, a desk lamp, the wood grain of the table, a distant plant."}
                  {groundingStep === 4 && "Examples: The fabric of your shirt, the texture of your pen, your feet planted on the floor, the temperature of the air."}
                  {groundingStep === 3 && "Examples: The hum of the ceiling fan, traffic outside, students walking, your own gentle breathing."}
                  {groundingStep === 2 && "Examples: Fresh notebook paper, coffee or tea aroma, laundry detergent on your sleeve, rain outside."}
                  {groundingStep === 1 && "Examples: The lingering taste of water or mint, your toothpaste, or taking a slow sip of water."}
                </p>

                {/* Input fields for current step */}
                <div className="space-y-2 pt-2">
                  {groundingInputs[groundingStep].map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const updated = [...groundingInputs[groundingStep]];
                        updated[idx] = e.target.value;
                        setGroundingInputs({ ...groundingInputs, [groundingStep]: updated });
                      }}
                      placeholder={`#${idx + 1} (e.g. type or mentally acknowledge)`}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ))}
                </div>
              </div>

              {/* Step Navigation Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={groundingStep === 5}
                  onClick={() => setGroundingStep((s) => s + 1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous Step
                </button>

                {groundingStep > 1 ? (
                  <button
                    onClick={() => setGroundingStep((s) => s - 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Next Step
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setGroundingComplete(true);
                      if (onActivityCompleted) onActivityCompleted("Completed 5-4-3-2-1 Sensory Grounding");
                    }}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Finish Grounding
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">Grounding Complete</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Great work. Take a deep, gentle breath and notice how your body feels anchored right here, safe in the present moment.
                </p>
              </div>
              <button
                onClick={() => {
                  setGroundingComplete(false);
                  setGroundingStep(5);
                  setGroundingInputs({
                    5: ["", "", "", "", ""],
                    4: ["", "", "", ""],
                    3: ["", "", ""],
                    2: ["", ""],
                    1: [""],
                  });
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
              >
                Practice Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. RELAXATION & AMBIENT SOUNDS TAB */}
      {activeSubTab === "ambient" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Calming Soundscapes</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live synthesized white/pink noise frequencies designed to mask dorm distractions and encourage study flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Gentle Rain */}
            <div
              id="soundscape-rain"
              className={`p-5 rounded-xl border text-center transition-all ${
                activeAmbiance === "rain"
                  ? "border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-500/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-3">
                <CloudRain className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Soft Campus Rain</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Continuous gentle rainfall to soothe high nervous tension.</p>
              <button
                onClick={() => toggleSoundscape("rain")}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeAmbiance === "rain"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {activeAmbiance === "rain" ? "Stop Rain" : "Play Rain"}
              </button>
            </div>

            {/* Ocean Surf */}
            <div
              id="soundscape-ocean"
              className={`p-5 rounded-xl border text-center transition-all ${
                activeAmbiance === "ocean"
                  ? "border-teal-500 bg-teal-50/70 shadow-xs ring-1 ring-teal-500/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 mx-auto flex items-center justify-center mb-3">
                <Waves className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Deep Ocean Surf</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Rhythmic ocean tide frequencies for focused study reading.</p>
              <button
                onClick={() => toggleSoundscape("ocean")}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeAmbiance === "ocean"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {activeAmbiance === "ocean" ? "Stop Surf" : "Play Ocean"}
              </button>
            </div>

            {/* Forest Wind */}
            <div
              id="soundscape-forest"
              className={`p-5 rounded-xl border text-center transition-all ${
                activeAmbiance === "forest"
                  ? "border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/20"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <Trees className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Pine Forest Wind</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">Low-frequency natural whisper to calm intrusive thoughts.</p>
              <button
                onClick={() => toggleSoundscape("forest")}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeAmbiance === "forest"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {activeAmbiance === "forest" ? "Stop Wind" : "Play Wind"}
              </button>
            </div>
          </div>

          {/* Volume Control */}
          {activeAmbiance && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <Volume2 className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Sound Volume</span>
                  <span>{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. WELLNESS GUIDES & RIGHTS TAB */}
      {activeSubTab === "articles" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WELLNESS_ARTICLES.map((article) => (
              <div
                key={article.id}
                id={`article-card-${article.id}`}
                onClick={() => setSelectedArticle(article)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{article.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{article.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{article.summary}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>Read full guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Article Modal Reader */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">{selectedArticle.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedArticle.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
                  {selectedArticle.content.map((paragraph, i) => (
                    <p key={i} className="text-sm">{paragraph}</p>
                  ))}

                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 mt-4 text-teal-900">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-teal-950 mb-1">
                      <Info className="w-4 h-4 text-teal-700" />
                      Key Wellness Takeaway
                    </div>
                    <p className="text-xs font-medium text-teal-800">{selectedArticle.keyTakeaway}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
                  >
                    Done Reading
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
