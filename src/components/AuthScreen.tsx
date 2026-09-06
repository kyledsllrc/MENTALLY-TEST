import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import {
  Heart,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const translateFirebaseError = (errCode: string): string => {
    switch (errCode) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact PTC administration.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please verify your credentials or reset your password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists. Please sign in instead.";
      case "auth/weak-password":
        return "Password must be at least 6 characters long.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was closed before completing. Please try again.";
      case "auth/cancelled-popup-request":
        return "Google sign-in popup was cancelled.";
      case "auth/popup-blocked":
        return "The sign-in popup was blocked by your browser. Please allow popups for this site.";
      case "auth/network-request-failed":
        return "Network connection issue. Please check your internet connection.";
      case "auth/operation-not-allowed":
        return "This sign-in method is not yet enabled in your Firebase Console. Enable Email/Password or Google in Firebase Auth > Sign-in method.";
      default:
        return "Authentication error. Please try again.";
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both your email and password.");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full name or preferred nickname.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please re-enter.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setSuccessMsg("Signed in successfully. Welcome back to MentAlly!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        if (fullName.trim() && userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: fullName.trim(),
          });
        }
        setSuccessMsg("Account created successfully! Welcome to MentAlly.");
      }
      onSuccess?.();
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      const code = err?.code || "";
      setErrorMsg(translateFirebaseError(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMsg("Signed in with Google successfully!");
      onSuccess?.();
    } catch (err: any) {
      console.error("Firebase Google auth error:", err);
      const code = err?.code || "";
      setErrorMsg(translateFirebaseError(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg("Please enter your email to receive a password reset link.");
      return;
    }
    setIsForgotLoading(true);
    setErrorMsg(null);
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setSuccessMsg(`Password reset link sent to ${forgotEmail}. Please check your inbox or spam.`);
      setIsForgotModalOpen(false);
      setForgotEmail("");
    } catch (err: any) {
      setErrorMsg(translateFirebaseError(err?.code || ""));
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Branding Banner */}
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-teal-600/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-3">
              <Heart className="w-6 h-6 text-teal-300 fill-teal-300/40" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black tracking-tight text-white">MentAlly</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-teal-700/80 text-teal-200 rounded-full border border-teal-600/60">
                PTC
              </span>
            </div>

            <p className="text-xs text-teal-100/90 font-medium max-w-xs leading-relaxed">
              Student Mental Wellness & Academic Self-Care Platform
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-200/80 font-medium">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Pateros Technological College</span>
            </div>
          </div>
        </div>

        {/* Auth Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Google / Gmail Sign In */}
          <button
            id="auth-google-btn"
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-xs active:scale-[0.99] disabled:opacity-50"
          >
            {/* Real Official Google SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google / Gmail</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              or use student email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {mode === "register" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name / Nickname
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-register-fullname"
                    type="text"
                    required
                    placeholder="e.g., Franklin Luzano"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-input-email"
                  type="email"
                  required
                  placeholder="student@pateros.edu.ph or gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-input-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to MentAlly" : "Create My Student Account"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Footnote */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Securely authenticated via Google Firebase. Privacy assured.</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reset Password</h3>
                <p className="text-[11px] text-slate-500">We'll send a secure password reset link to your email.</p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@pateros.edu.ph"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isForgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
