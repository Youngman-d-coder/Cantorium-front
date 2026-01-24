import { useState, type FormEvent, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildUrl, endpoints } from "../config";
import { useAuth } from "../auth";
import { useToast } from "../components/ui/Toast";
import { Button, Input, ProgressBar } from "../components/ui/Components";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useToast();

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const passwordStrengthLabel = useMemo(() => {
    if (passwordStrength === 0) return { label: "", color: "rose" as const };
    if (passwordStrength <= 2) return { label: "Weak", color: "rose" as const };
    if (passwordStrength <= 3) return { label: "Fair", color: "amber" as const };
    if (passwordStrength <= 4) return { label: "Good", color: "emerald" as const };
    return { label: "Strong", color: "emerald" as const };
  }, [passwordStrength]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }
    
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(buildUrl(endpoints.authSignUp), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Sign up failed");
      }
      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        token: data.token,
      };
      setUser(user);
      showToast(`Welcome to Cantorium, ${user.name}! 🎵`, "success");
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create account. Try again.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 animate-fade-in-down">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-lg font-bold text-cyan-200 transition-transform group-hover:scale-105">
            C
          </div>
          <span className="text-xl font-semibold text-slate-50">Cantorium</span>
        </Link>
        <Link
          to="/signin"
          className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-cyan-100"
        >
          Sign In
        </Link>
      </nav>

      <div className="mx-auto max-w-xl px-6 py-12 animate-fade-in-up">
        <div className="space-y-6 rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-xl shadow-emerald-900/30">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/80">Join Cantorium</p>
            <h1 className="text-2xl font-semibold text-slate-50">Create your account</h1>
            <p className="text-sm text-slate-300">Start creating AI-powered choral music today.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Your name"
              error={errors.name}
              autoComplete="name"
            />
            
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            
            <div className="space-y-2">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="At least 6 characters"
                error={errors.password}
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
              />
              {password && (
                <div className="space-y-1">
                  <ProgressBar value={passwordStrength} max={5} size="sm" color={passwordStrengthLabel.color} />
                  <p className={`text-xs ${passwordStrengthLabel.color === 'rose' ? 'text-rose-400' : passwordStrengthLabel.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Password strength: {passwordStrengthLabel.label}
                  </p>
                </div>
              )}
            </div>
            
            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: "" }));
              }}
              placeholder="Repeat password"
              error={errors.confirm}
              autoComplete="new-password"
            />

            {/* Terms agreement */}
            <div className="space-y-1">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/30"
                />
                <span className="text-sm text-slate-400">
                  I agree to the{" "}
                  <Link to="/terms" className="text-emerald-300 hover:text-emerald-100 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-emerald-300 hover:text-emerald-100 transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <span>⚠</span> {errors.terms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="success"
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-4 text-slate-500">Or sign up with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-800 hover:border-slate-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-800 hover:border-slate-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-emerald-300 hover:text-emerald-100 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
