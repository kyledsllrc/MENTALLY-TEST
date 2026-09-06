import React from "react";
import { 
  Heart, 
  ShieldAlert, 
  Smartphone, 
  Monitor, 
  Flame, 
  Sparkles,
  Info
} from "lucide-react";

interface HeaderProps {
  onOpenEmergency: () => void;
  streakDays: number;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergency,
  streakDays,
  isMobileFrame,
  onToggleFrame,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Project Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">MentAlly</h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-teal-100/70 text-teal-800 rounded-full border border-teal-200">
                AI Self-Care
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
              Personalized Mental Wellness for College Students
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak badge */}
          <div 
            id="streak-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-900 shadow-2xs"
            title="Daily Mental Wellness Streak"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Device frame switcher */}
          <button
            id="toggle-view-frame-btn"
            onClick={onToggleFrame}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            title={isMobileFrame ? "Switch to Full Layout" : "Switch to Mobile Device View"}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-teal-600" />
                <span>Full Layout</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                <span>Mobile Frame</span>
              </>
            )}
          </button>

          {/* About / Academic Capsule Info */}
          <button
            id="open-about-btn"
            onClick={onOpenAbout}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            title="System Analysis & Capsule Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Emergency SOS hotline */}
          <button
            id="emergency-sos-btn"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Crisis Lines</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
