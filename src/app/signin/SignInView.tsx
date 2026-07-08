"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Brain, Mail, Loader2, Eye, EyeOff } from "lucide-react";

export default function SignInView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neuro-950">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 animate-pulse" />
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neuro-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 animate-pulse" />
          <p className="text-xs text-slate-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (tab === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (tab === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password.trim(),
        name: tab === "signup" ? name.trim() : "",
        action: tab,
        redirect: false,
      });

      if (result?.ok) {
        // Session is set — do a hard navigation to ensure cookie is picked up
        window.location.replace("/dashboard");
        return;
      }

      // Sign in/up failed
      if (tab === "signin") {
        setError("Invalid email or password. Don\u2019t have an account? Sign up below.");
      } else {
        setError("Could not create account. This email may already be registered.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  function switchTab(to: "signin" | "signup") {
    setTab(to);
    setError("");
    setConfirm("");
    setShowPw(false);
    setShowConfirm(false);
  }

  const inputCls = "w-full rounded-xl border border-white/[0.08] bg-neuro-950/60 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400/40 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neuro-950 bg-grid px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
            <Brain className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-slate-400">
            {tab === "signin" ? "Sign in to continue learning" : "Start your learning journey"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
          <div className="relative flex justify-center"><span className="bg-neuro-950 px-3 text-xs text-slate-600">or use email</span></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} required />
          )}

          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="Email address" className={inputCls} required />

          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Password" className={`${inputCls} pr-10`} required minLength={4} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" tabIndex={-1}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {tab === "signup" && (
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Confirm password" className={`${inputCls} pr-10`} required minLength={4} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" tabIndex={-1}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          {error && <p className="text-xs text-rose-400 px-1">{error}</p>}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:scale-[1.02]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-slate-500 mt-5">
          {tab === "signin" ? (
            <>{"Don\u2019t have an account? "}<button onClick={() => switchTab("signup")} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Sign up</button></>
          ) : (
            <>{"Already have an account? "}<button onClick={() => switchTab("signin")} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Sign in</button></>
          )}
        </p>

        <div className="text-center mt-4">
          <a href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Back to home</a>
        </div>
      </div>
    </div>
  );
}
