import React, { useState } from "react";
import { 
  Lock, 
  Unlock, 
  EyeOff, 
  Eye, 
  BookOpen, 
  Shield, 
  CheckCircle,
  KeyRound
} from "lucide-react";

interface PrivacyShieldProps {
  isLocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  isCamouflageActive: boolean;
  onToggleCamouflage: () => void;
}

export const PrivacyShield: React.FC<PrivacyShieldProps> = ({
  isLocked,
  onUnlock,
  onLock,
  isCamouflageActive,
  onToggleCamouflage,
}) => {
  const [pinInput, setPinInput] = useState("");
  const [savedPin, setSavedPin] = useState(() => {
    try {
      return localStorage.getItem("mentally_pin") || "";
    } catch {
      return "";
    }
  });
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnlockAttempt = () => {
    if (pinInput === savedPin || !savedPin) {
      setErrorMsg("");
      setPinInput("");
      onUnlock();
    } else {
      setErrorMsg("Incorrect 4-digit PIN. Try again.");
    }
  };

  const handleSavePin = () => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setErrorMsg("PIN must be exactly 4 numeric digits.");
      return;
    }
    setSavedPin(newPin);
    try {
      localStorage.setItem("mentally_pin", newPin);
    } catch {}
    setIsSettingPin(false);
    setNewPin("");
    setErrorMsg("");
  };

  const handleRemovePin = () => {
    setSavedPin("");
    try {
      localStorage.removeItem("mentally_pin");
    } catch {}
    setErrorMsg("");
  };

  if (isCamouflageActive) {
    return (
      <div 
        id="academic-camouflage-screen" 
        className="fixed inset-0 z-50 bg-slate-100 text-slate-900 font-sans p-6 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-lg p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                PATEROS TECHNOLOGICAL COLLEGE • IICT
              </span>
              <h1 className="text-xl font-bold text-slate-800 mt-1">
                IT 312: Systems Analysis & Software Architecture Lecture Notes
              </h1>
              <p className="text-xs text-slate-500">Module 4: Normalized Database Schema & Entity-Relationship Modeling</p>
            </div>
            <button
              onClick={onToggleCamouflage}
              className="px-3 py-1.5 rounded bg-slate-800 text-white text-xs font-mono hover:bg-slate-700 transition-colors"
            >
              Resume MentAlly App [Esc]
            </button>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-sm font-bold text-slate-900">4.1 Overview of Relational Integrity</h2>
            <p>
              In software engineering, normalization organizes columns and tables of a relational database to minimize data redundancy. 
              The First Normal Form (1NF) requires each column contain atomic values, and each record must be distinct. Second Normal Form (2NF) enforces full functional dependency on the candidate key.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-800">
              <p className="font-bold">// Example SQL Table DDL Definition</p>
              <p>CREATE TABLE student_records (</p>
              <p className="pl-4">student_id VARCHAR(15) PRIMARY KEY,</p>
              <p className="pl-4">academic_program VARCHAR(50) NOT NULL,</p>
              <p className="pl-4">enrollment_status VARCHAR(20) DEFAULT 'ACTIVE'</p>
              <p>);</p>
            </div>

            <h2 className="text-sm font-bold text-slate-900 pt-2">4.2 Agile Scrum Methodology in Capstone Development</h2>
            <p>
              Students preparing their capstone software requirements must adhere to iterative two-week sprint cycles. 
              Ensure standup logs and sprint retrospectives are documented for the final evaluation panel.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onToggleCamouflage}
              className="text-xs text-slate-400 hover:text-slate-600 font-mono"
            >
              Click here to return to your self-care session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div 
        id="privacy-shield-lockscreen" 
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Privacy Shield Activated</h3>
            <p className="text-xs text-slate-500">
              Your mental wellness journals and logs are locked to protect student privacy on shared campus devices.
            </p>
          </div>

          {savedPin ? (
            <div className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlockAttempt()}
                className="w-full text-center tracking-[1em] text-lg font-mono py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              {errorMsg && <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>}
              <button
                onClick={handleUnlockAttempt}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Unlock Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">No PIN is set. Click below to unlock directly.</p>
              <button
                onClick={onUnlock}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
              >
                Unlock Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="privacy-controls-bar" className="flex items-center gap-2">
      <button
        onClick={onToggleCamouflage}
        title="Instant Academic Camouflage (Masks screen as lecture notes in PTC labs)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all"
      >
        <BookOpen className="w-3.5 h-3.5 text-teal-600" />
        <span className="hidden sm:inline">Camouflage</span>
      </button>

      {savedPin ? (
        <button
          onClick={onLock}
          title="Lock App with PIN"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Lock</span>
        </button>
      ) : (
        <button
          onClick={() => setIsSettingPin(true)}
          title="Set 4-Digit Security PIN"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-all"
        >
          <KeyRound className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Set PIN</span>
        </button>
      )}

      {/* Pin Setup Modal */}
      {isSettingPin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              Set Private 4-Digit PIN
            </h4>
            <p className="text-xs text-slate-500">
              Useful when using PTC campus laboratory terminals or shared laptops.
            </p>

            <input
              type="password"
              maxLength={4}
              placeholder="0000"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full text-center tracking-[1em] text-lg font-mono py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
            {errorMsg && <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsSettingPin(false);
                  setErrorMsg("");
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePin}
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                Save PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
